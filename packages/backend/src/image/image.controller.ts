import { Controller, Post, UseInterceptors, UploadedFile, Get, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Public } from 'src/auth/constants';

@Controller('image')
export class ImageController {
  @Public()
  @Post('upload')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './dist/uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
      },
    }),
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File): { path: string } {
    return { path: file.filename };
  }

  @Public()
  @Get(':filename')
  serveImage(@Param('filename') filename: string, @Res() res: Response) {
    const imagePath = join(__dirname, '..', 'uploads', filename);
    res.sendFile(imagePath);
  }
}
