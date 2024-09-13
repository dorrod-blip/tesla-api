import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class DashboardService {
  private readonly baseUrl = 'https://fleet-api.prd.na.vn.cloud.tesla.com';
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
    const url = `${this.baseUrl}/api/1/vehicles/${req.query.id}/vehicle_data?endpoints=vehicle_state`;
    const access_token = req.query.access_token;
    
    try {
      const options = {
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
        },
      };
  
      const response = await axios.get(url, options);
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
    const url = `${this.baseUrl}/api/1/vehicles/${req.query.vin}/command/door_lock`;
    const access_token = req.query.access_token;
    
    try {
      const options = {
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
        },
      };
  
      const response = await axios.get(url, options);
      console.log(response.data);
      return response.data.response.result;
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    // const api_key = this.configService.get('TRELLO_API_KEY');
    // if (!req.query.ids) {
    //   return;
    // }
    // const data : any = [];
    // for (let item of req.query.ids) {
    //     const url = `https://api.trello.com/1/lists/${item.id}/cards?key=${api_key}&token=${req.query.access_token}`
    //     const response = await fetch(url);
    //     const json = await response.json();
    //     const temp = {
    //       list_id: item.id,
    //       list_name: item.name,
    //       card: json
    //     }
    //     data.push(temp);
    // }
    // return data;
  }

  async setUnlock(req: any) {
    const url = `${this.baseUrl}/api/1/vehicles/${req.query.vin}/command/door_unlock`;
    const access_token = req.query.access_token;
    
    try {
      const options = {
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
        },
      };
  
      const response = await axios.get(url, options);
      console.log(response.data);
      return response.data.response.result;
    } catch (error) {
      console.error("Error fetching data:", error);
    }

  //   const {boardID} = req.params;
  //   const url =`https://api.trello.com/1/boards/${boardID}/lists`;
  //   const api_key = this.configService.get('TRELLO_API_KEY');
  //   const params = {
  //     key: api_key,
  //     token: req.query.access_token
  //   };

  //   const response = await this.httpService.axiosRef.get(url, {
  //     params
  //   });
  //   const json = response.data;
  //   console.log(json);
  //   return json;
  }
}
