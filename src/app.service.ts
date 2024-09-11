import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getKey(): string {
    return 'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE3sT4B4jJwKMLdd5UeNbmyGIyw6IzTBH5Y8I469UTgLG47IxnKX94HuPenskt1UJLBnIyUDC4elk6rSXX5J8fcw==';
  }
}
