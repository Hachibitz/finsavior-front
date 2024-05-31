import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GenericResponse } from "../model/main.model";
import { SubscriptionRequest } from "../model/payment.model";
import { ResponseOnApproveData } from "../model/subscription-paypal.model";
import { CREATE_SUBSCRIPTION } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class PaymentService {

    constructor(private http: HttpClient) {

    }

    createSubscription(subscription: SubscriptionRequest): Promise<GenericResponse> {
        const promessa = new Promise<GenericResponse>((resolve, reject) => {
            this.http.post(CREATE_SUBSCRIPTION, subscription, { responseType: 'json' }).subscribe({
                next: (result: GenericResponse) => {
                    resolve(result);
                },
                error: (e: HttpErrorResponse) => {
                    reject(e);
                }
            });
        });

        return promessa;
    }

    mapSubscriptionDetailsToRequest(details: ResponseOnApproveData): SubscriptionRequest {
        return {
          planId: details.plan_id,
          externalUserId: details.subscriber.payer_id,
          subscriptionId: details.id,
          intent: 'subscription', 
          status: details.status,
          purchaseUnits: [
            {
              referenceId: details.id, 
              amount: {
                currencyCode: details.shipping_amount.currency_code,
                value: details.shipping_amount.value
              },
              payee: {
                emailAddress: details.subscriber.email_address,
                merchantId: '' 
              }
            }
          ],
          payer: {
            name: {
              fullName: `${details.subscriber.name.given_name} ${details.subscriber.name.surname}`,
              givenName: details.subscriber.name.given_name,
              surName: details.subscriber.name.surname
            },
            externalEmailAddress: details.subscriber.email_address,
            externalPayerId: details.subscriber.payer_id
          },
          createTime: new Date(details.create_time)
        };
      }
}