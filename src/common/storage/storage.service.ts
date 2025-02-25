// src/storage/storage.service.ts
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class StorageService {
  private blobServiceClient: BlobServiceClient;
  private containerClient: ContainerClient;

  constructor(private readonly configSrv: ConfigService) {
    const connectionString = configSrv.get("AZURE_STORAGE_CONNECTION_STRING");
    if (!connectionString) {
      throw new Error(
        "Azure Storage connection string not found in environment variables.",
      );
    }

    // Initialize the BlobServiceClient
    this.blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
    // Specify a container name (e.g., "uploads")
    this.containerClient = this.blobServiceClient.getContainerClient("chatter");
  }

  // Ensure the container exists
  async ensureContainerExists(): Promise<void> {
    const exists = await this.containerClient.exists();
    if (!exists) {
      await this.containerClient.create();
    }
  }

  // Upload a file to the container
  async uploadFile(fileBuffer: Buffer, blobName: string): Promise<string> {
    try {
      // Ensure the container exists before uploading
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

  // Download a file from the container
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

  // Helper: Convert readable stream to Buffer
  private streamToBuffer(
    readableStream: NodeJS.ReadableStream,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks = [];
      readableStream.on("data", (data) =>
        chunks.push(data instanceof Buffer ? data : Buffer.from(data)),
      );
      readableStream.on("end", () => resolve(Buffer.concat(chunks)));
      readableStream.on("error", reject);
    });
  }
}
