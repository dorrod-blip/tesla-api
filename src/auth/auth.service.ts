import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import fetch from 'node-fetch';
import axios from 'axios';

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
    console.log("code: ", code);

    const options = {
      headers: { 'Content-Type': 'application/json' },
    };
    try {
        const response = await axios.post(url, data, options);
        console.log(response.data);
        this.getPartnerToken();
        return response.data;
    } catch (error) {
        // console.error('Error fetching token:', error);
    }
  }

  async getPartnerToken() {
    const url = 'https://auth.tesla.com/oauth2/v3/token';
    const client_id = this.configService.get('TESLA_CLIENT_ID');
    const client_secret = this.configService.get('TESLA_CLIENT_SECRET');
    const scope = this.configService.get('TESLA_SCOPE');

    const data = {
      grant_type: 'client_credentials',
      client_id: client_id,
      client_secret: client_secret,
      audience: 'https://fleet-api.prd.na.vn.cloud.tesla.com',
      scope: scope, 
    };
    
    const options = {
      headers: { 'Content-Type': 'application/json' },
    };

    try {
      const response = await axios.post(url, data, options);
      const access_token = response.data.access_token;
      this.register(access_token);
    } catch(error) {

    }
  }

  async register (access_token: string) {
    const data = {
      "domain": "http://localhost:3000",
    };
    const url = 'https://fleet-api.prd.na.vn.cloud.tesla.com/api/1/partner_accounts'
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`,
      }
    };
    try {
      const response = await axios.post(url, data, options);
      const public_key = response.data.public_key;
      console.log("domain: ", public_key);
    } catch(error) {

    }
  }
}
