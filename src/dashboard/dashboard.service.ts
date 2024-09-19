import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as https from 'https';

@Injectable()
export class DashboardService {
  private readonly baseUrl = 'https://fleet-api.prd.na.vn.cloud.tesla.com';
  private readonly proxyUrl = 'https://localhost:4443';
  private caCert: Buffer = fs.readFileSync('./tls-cert.pem');

  constructor() {}

    async getVins(req: any) {
      const access_token = req.query.access_token;
      const url = `${this.baseUrl}/api/1/vehicles`;
      try {
        const options = {
          headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${access_token}`,
          },
        };
    
        const response = await axios.get(url, options);
        const data = [];
        response.data.response?.map((item: any) => {
          const temp = {
            id: item.id,
            vin: item.vin,
          }
          data.push(temp);
        });
        console.log("vins data: ", data);
        return data;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
  }

  async getVehicle(req: any) {
    const url : string = `${this.proxyUrl}/api/1/vehicles/${req.query.id}/vehicle_data?endpoints=vehicle_state`;
    const access_token : string = req.query.access_token;
    
    try {
      const headers =  { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`,
      };
      console.log("cert: ", this.caCert);
      
      const response = await axios.get(url, {
        headers: headers,
        httpsAgent: new https.Agent({
          ca: this.caCert
        })
      });
      const item = response.data.response;
      const data = {
        id: item.id,
        vin: item.vin,
        isLocked: item.vehicle_state.locked,
      }
      console.log("vehicle data: ", data);
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async setLock(req: any) {
    const url : string = `${this.proxyUrl}/api/1/vehicles/${req.query.vin}/command/door_lock`;
    const access_token : string = req.query.access_token;
    
    try {
      const headers = { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`,
      };

      const data : object = {};
      console.log("cert: ", this.caCert);
      const response = await axios.post(url, data, {
        headers: headers,
        httpsAgent: new https.Agent({
          ca: this.caCert
        })
      });
      console.log(response.data);
      return response.data.response;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async setUnlock(req: any) {
    const url : string = `${this.proxyUrl}/api/1/vehicles/${req.query.vin}/command/door_unlock`;
    const access_token : string = req.query.access_token;
    
    try {
      const headers = { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`,
      };

      const data : object = {};
      console.log("cert: ", this.caCert);
      const response = await axios.post(url, data, {
        headers: headers,
        httpsAgent: new https.Agent({
          ca: this.caCert
        })
      });
      console.log(response.data);
      return response.data.response;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
}
