// src/common/storage/storage.service.ts
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { ConfigService } from "@nestjs/config";
import * as fs from "fs";
import * as path from "path";

// Define a minimal interface for storage operations
interface IStorageDriver {
  uploadFile(fileBuffer: Buffer, blobName: string): Promise<string>;
  downloadFile(blobName: string): Promise<Buffer>;
}

// Azure implementation (renamed)
class AzureStorageService implements IStorageDriver {
  private blobServiceClient: BlobServiceClient;
  private containerClient: ContainerClient;

  constructor(private readonly configSrv: ConfigService) {
    const connectionString = configSrv.get<string>(
      "AZURE_STORAGE_CONNECTION_STRING",
    );
    if (!connectionString) {
      throw new Error(
        "Azure Storage connection string not found in environment variables.",
      );
    }
    this.blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
    this.containerClient = this.blobServiceClient.getContainerClient("chatter");
  }

  private async ensureContainerExists(): Promise<void> {
    const exists = await this.containerClient.exists();
    if (!exists) {
      await this.containerClient.create();
    }
  }

  async uploadFile(fileBuffer: Buffer, blobName: string): Promise<string> {
    try {
      await this.ensureContainerExists();
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
      await blockBlobClient.uploadData(fileBuffer);
      return blockBlobClient.url;
    } catch (error) {
      throw new InternalServerErrorException(
        "Error uploading file to Azure Blob Storage.",
      );
    }
  }

  async downloadFile(blobName: string): Promise<Buffer> {
    try {
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
      const downloadResponse = await blockBlobClient.download();
      return await this.streamToBuffer(downloadResponse.readableStreamBody);
    } catch (error) {
      throw new InternalServerErrorException(
        "Error downloading file from Azure Blob Storage.",
      );
    }
  }

  private streamToBuffer(
    readableStream: NodeJS.ReadableStream,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      readableStream.on("data", (data) =>
        chunks.push(data instanceof Buffer ? data : Buffer.from(data as any)),
      );
      readableStream.on("end", () => resolve(Buffer.concat(chunks)));
      readableStream.on("error", reject);
    });
  }
}

// Local implementation
class LocalStorageService implements IStorageDriver {
  private readonly uploadDir: string;

  constructor(private readonly configSrv: ConfigService) {
    const defaultDir = "/app/storage/uploads";
    this.uploadDir = configSrv.get<string>("UPLOAD_DIR") || defaultDir;
  }

  async uploadFile(fileBuffer: Buffer, blobName: string): Promise<string> {
    try {
      // Ensure directory exists
      fs.mkdirSync(this.uploadDir, { recursive: true });
      const filePath = path.join(this.uploadDir, blobName);
      fs.writeFileSync(filePath, fileBuffer);

      // Return a relative URL that the frontend or static server can map
      // If UPLOADS_URL_PREFIX provided use it, else default to /uploads
      const prefix =
        this.configSrv.get<string>("UPLOADS_URL_PREFIX") || "/uploads";
      return `${prefix}/${blobName}`.replace(/\\/g, "/");
    } catch (error) {
      throw new InternalServerErrorException("Error saving file locally.");
    }
  }

  async downloadFile(blobName: string): Promise<Buffer> {
    try {
      const filePath = path.join(this.uploadDir, blobName);
      return fs.readFileSync(filePath);
    } catch (error) {
      throw new InternalServerErrorException("Error reading local file.");
    }
  }
}

// Facade that selects the driver based on STORAGE_DRIVER
@Injectable()
export class StorageService implements IStorageDriver {
  private driver: IStorageDriver;

  constructor(private readonly configSrv: ConfigService) {
    const selected = (
      configSrv.get<string>("STORAGE_DRIVER") || "local"
    ).toLowerCase();
    if (selected === "azure") {
      this.driver = new AzureStorageService(configSrv);
    } else if (selected === "local") {
      this.driver = new LocalStorageService(configSrv);
    } else {
      // default to local for safety
      this.driver = new LocalStorageService(configSrv);
    }
  }

  uploadFile(fileBuffer: Buffer, blobName: string): Promise<string> {
    return this.driver.uploadFile(fileBuffer, blobName);
  }

  downloadFile(blobName: string): Promise<Buffer> {
    return this.driver.downloadFile(blobName);
  }
}
