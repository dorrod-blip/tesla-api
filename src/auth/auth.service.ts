import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fetch from 'node-fetch';

@Injectable()
export class AuthsService {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  getQueryParams() {
    const state = Math.random().toString();
    
    const client_id = this.configService.get('TESLA_CLIENT_ID');
    const scope = this.configService.get('TESLA_SCOPE');
    const redirect_url = this.configService.get('TESLA_CALLBACK_URL');
    return `https://auth.tesla.com/oauth2/v3/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_url}&scope=${scope}&state=${state}`;
  }

  async requestAuthorize(code: string) {
    const url = 'https://auth.tesla.com/oauth2/v3/token';
    const client_id = this.configService.get('TESLA_CLIENT_ID');
    const client_secret = this.configService.get('TESLA_CLIENT_SECRET');
    const redirect_url = this.configService.get('TESLA_CALLBACK_URL');
    const data = {
      grant_type: 'authorization_code',
      client_id: client_id,
      client_secret: client_secret,
      code: code,
      audience: 'https://fleet-api.prd.na.vn.cloud.tesla.com',
      redirect_uri: redirect_url
    };

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };

    const response = await fetch(url, options);

    const json = await response.json();

    return json;
  }

  async getProfile(access_token: string) {
    const url = 'https://api.trello.com/1/members/me/';

    const api_key = this.configService.get('TRELLO_API_KEY');
    const params = {
      key: api_key,
      token: access_token
    };
    
    const response = await fetch(`${url}?key=${api_key}&token=${access_token}`);

    const data = await response.json();
    return data;
  }
}
