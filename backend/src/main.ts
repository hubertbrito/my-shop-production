import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- HABILITAÇÃO DO CORS ---
  app.enableCors({
    origin: 'http://localhost:5173', // Permite requisições APENAS do seu frontend Vite
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos HTTP permitidos
    credentials: true, // Necessário se for usar cookies ou credenciais em requisições
  });
  // --- FIM DA HABILITAÇÃO DO CORS ---

  const port = process.env.PORT || 3000; // Usa a porta do .env ou 3000 como padrão
  await app.listen(port);
  console.log(`Backend is running on: ${await app.getUrl()}`);
}
bootstrap();