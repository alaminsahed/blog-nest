import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/user/guards/auth.guards';
import { ArticleService } from './article.service';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  @Post('/')
  @UseGuards(AuthGuard)
  async createArticle(): Promise<any> {
    return this.articleService.createArticle();
  }
}
