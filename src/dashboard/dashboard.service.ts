import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';

@Injectable()
export class DashboardService {
  private readonly baseUrl = 'https://fleet-api.prd.na.vn.cloud.tesla.com';
  private readonly proxyUrl = 'https://localhost:4443';
  private caCert: Buffer;
  private ca = `-----BEGIN CERTIFICATE-----
MIIFgTCCBGmgAwIBAgIQOXJEOvkit1HX02wQ3TE1lTANBgkqhkiG9w0BAQwFADB7
MQswCQYDVQQGEwJHQjEbMBkGA1UECAwSR3JlYXRlciBNYW5jaGVzdGVyMRAwDgYD
VQQHDAdTYWxmb3JkMRowGAYDVQQKDBFDb21vZG8gQ0EgTGltaXRlZDEhMB8GA1UE
AwwYQUFBIENlcnRpZmljYXRlIFNlcnZpY2VzMB4XDTE5MDMxMjAwMDAwMFoXDTI4
MTIzMTIzNTk1OVowgYgxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpOZXcgSmVyc2V5
MRQwEgYDVQQHEwtKZXJzZXkgQ2l0eTEeMBwGA1UEChMVVGhlIFVTRVJUUlVTVCBO
ZXR3b3JrMS4wLAYDVQQDEyVVU0VSVHJ1c3QgUlNBIENlcnRpZmljYXRpb24gQXV0
aG9yaXR5MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAgBJlFzYOw9sI
s9CsVw127c0n00ytUINh4qogTQktZAnczomfzD2p7PbPwdzx07HWezcoEStH2jnG
vDoZtF+mvX2do2NCtnbyqTsrkfjib9DsFiCQCT7i6HTJGLSR1GJk23+jBvGIGGqQ
Ijy8/hPwhxR79uQfjtTkUcYRZ0YIUcuGFFQ/vDP+fmyc/xadGL1RjjWmp2bIcmfb
IWax1Jt4A8BQOujM8Ny8nkz+rwWWNR9XWrf/zvk9tyy29lTdyOcSOk2uTIq3XJq0
tyA9yn8iNK5+O2hmAUTnAU5GU5szYPeUvlM3kHND8zLDU+/bqv50TmnHa4xgk97E
xwzf4TKuzJM7UXiVZ4vuPVb+DNBpDxsP8yUmazNt925H+nND5X4OpWaxKXwyhGNV
icQNwZNUMBkTrNN9N6frXTpsNVzbQdcS2qlJC9/YgIoJk2KOtWbPJYjNhLixP6Q5
D9kCnusSTJV882sFqV4Wg8y4Z+LoE53MW4LTTLPtW//e5XOsIzstAL81VXQJSdhJ
WBp/kjbmUZIO8yZ9HE0XvMnsQybQv0FfQKlERPSZ51eHnlAfV1SoPv10Yy+xUGUJ
5lhCLkMaTLTwJUdZ+gQek9QmRkpQgbLevni3/GcV4clXhB4PY9bpYrrWX1Uu6lzG
KAgEJTm4Diup8kyXHAc/DVL17e8vgg8CAwEAAaOB8jCB7zAfBgNVHSMEGDAWgBSg
EQojPpbxB+zirynvgqV/0DCktDAdBgNVHQ4EFgQUU3m/WqorSs9UgOHYm8Cd8rID
ZsswDgYDVR0PAQH/BAQDAgGGMA8GA1UdEwEB/wQFMAMBAf8wEQYDVR0gBAowCDAG
BgRVHSAAMEMGA1UdHwQ8MDowOKA2oDSGMmh0dHA6Ly9jcmwuY29tb2RvY2EuY29t
L0FBQUNlcnRpZmljYXRlU2VydmljZXMuY3JsMDQGCCsGAQUFBwEBBCgwJjAkBggr
BgEFBQcwAYYYaHR0cDovL29jc3AuY29tb2RvY2EuY29tMA0GCSqGSIb3DQEBDAUA
A4IBAQAYh1HcdCE9nIrgJ7cz0C7M7PDmy14R3iJvm3WOnnL+5Nb+qh+cli3vA0p+
rvSNb3I8QzvAP+u431yqqcau8vzY7qN7Q/aGNnwU4M309z/+3ri0ivCRlv79Q2R+
/czSAaF9ffgZGclCKxO/WIu6pKJmBHaIkU4MiRTOok3JMrO66BQavHHxW/BBC5gA
CiIDEOUMsfnNkjcZ7Tvx5Dq2+UUTJnWvu6rvP3t3O9LEApE9GQDTF1w52z97GA1F
zZOFli9d31kWTz9RvdVFGD/tSo7oBmF0Ixa1DVBzJ0RHfxBdiSprhTEUxOipakyA
vGp4z7h/jnZymQyd/teRCBaho1+V
-----END CERTIFICATE-----`
  constructor() {
    const certPath = path.join(__dirname, '..', '..', 'tls-cert.pem');
    this.caCert = fs.readFileSync(certPath);
  }

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

  async createTelemetry(req: any) {
    const url : string = `${this.proxyUrl}/api/1/vehicles/fleet_telemetry_config`;
    const access_token : string = req.query.access_token;
    try {
      const headers = { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`,
      };

      const data : object = {
        config: {
          port: 8443,
          exp: 1750000000,
          fields: {
            Location: {
              interval_seconds: 50,
            },
            Soc: {
              interval_seconds: 30,
            },
          },
          ca: `${this.ca}`,
          hostname: 'teslaapi.moovetrax.com'
        },
        vins: [req.query.vin],
      };
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
