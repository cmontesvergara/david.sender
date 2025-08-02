import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('api/v1/observability')
export class ObservabilityController {
  private readonly LOG_PATH = process.env.LOG_PATH || '';

  private getLogFilePath(fileName: string): string {
    return path.join(this.LOG_PATH, fileName);
  }

  private validateLogDirectory(): void {
    if (!fs.existsSync(this.LOG_PATH)) {
      throw new NotFoundException('Log directory does not exist.');
    }
  }

  private validateLogFile(fileName: string): string {
    const filePath = this.getLogFilePath(fileName);
    if (
      !fs.existsSync(filePath) ||
      !fs.statSync(filePath).isFile() ||
      path.extname(fileName) !== '.log'
    ) {
      throw new NotFoundException('Log file does not exist.');
    }
    return filePath;
  }

  @Get('logs/list')
  availableLogs() {
    this.validateLogDirectory();
    const fileNames = fs.readdirSync(this.LOG_PATH).filter((file) => {
      const filePath = this.getLogFilePath(file);
      return fs.statSync(filePath).isFile() && path.extname(file) === '.log';
    });
    return { files: fileNames };
  }

  @Get('logs/file/:fileName')
  getLogFile(@Param('fileName') fileName: string) {
    const filePath = this.validateLogFile(fileName);
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return content;
    } catch {
      throw new InternalServerErrorException('Error reading log file.');
    }
  }

  @Get('logs/download/:fileName')
  downloadLogFile(@Param('fileName') fileName: string, @Res() res: Response) {
    const filePath = this.validateLogFile(fileName);
    return res.download(filePath, fileName, (err) => {
      if (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'Error downloading log file.',
        });
      }
    });
  }

  @Delete('logs/file/:fileName')
  deleteLogFile(@Param('fileName') fileName: string) {
    const filePath = this.validateLogFile(fileName);
    try {
      fs.unlinkSync(filePath);
      return { message: `Log file ${fileName} deleted successfully.` };
    } catch {
      throw new InternalServerErrorException('Error deleting log file.');
    }
  }

  @Delete('logs/delete-all')
  deleteAllLogFiles() {
    this.validateLogDirectory();
    try {
      const fileNames = fs.readdirSync(this.LOG_PATH).filter((file) => {
        const filePath = this.getLogFilePath(file);
        return fs.statSync(filePath).isFile() && path.extname(file) === '.log';
      });

      fileNames.forEach((file) => {
        const filePath = this.getLogFilePath(file);
        fs.unlinkSync(filePath);
      });

      return {
        message: 'All log files deleted successfully.',
        deletedFiles: fileNames,
      };
    } catch {
      throw new InternalServerErrorException('Error deleting log files.');
    }
  }
}
