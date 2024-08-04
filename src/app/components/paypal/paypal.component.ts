import { Component, Input, OnInit } from '@angular/core';
import { PLANS_LIST, SubscriptionRequest } from 'src/app/model/payment.model';
import { ResponseOnApproveData } from 'src/app/model/subscription-paypal.model';
import { DialogMessage } from 'src/app/services/dialog-message.service';
import { LoadingService } from 'src/app/services/loading-service';
import { PaymentService } from 'src/app/services/payment.service';
import { CLIENT_ID } from 'src/environments/environment';

declare var paypal: any;

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.scss']
})
export class PaypalComponent implements OnInit {
  @Input() planId: string;
  paypalScript: HTMLScriptElement;

  constructor(private paymentService: PaymentService, private dialogMessage: DialogMessage, private loadingService: LoadingService) {
    
  }

  loading: boolean = false;

  ngOnInit() {
    this.loadPaypalScript().then(() => {
      this.initializePaypalButtons(this.planId);
    }).catch((error) => {
      console.error('PayPal script loading failed:', error);
    });
  }

  private loadPaypalScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById('paypal-script')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'paypal-script';
      script.src = 'https://www.paypal.com/sdk/js?client-id='+CLIENT_ID+'&vault=true&intent=subscription&currency=BRL';
      script.onload = () => {
        resolve();
      };
      script.onerror = (error) => {
        reject(error);
      };
      document.body.appendChild(script);
    });
  }

  private initializePaypalButtons(planId: string) {
    if (typeof paypal !== 'undefined') {
      paypal.Buttons({
        style: {
          label: "subscribe",
          layout: "vertical",
          shape: "pill",
          color: "blue",
          tagline: false,
        },
        createSubscription: (data, actions) => {
          return actions.subscription.create({
            plan_id: planId 
          });
        },
        
        onApprove: (data, actions) => {
          actions.subscription.get().then(details => {
            this.saveSubscription(details);
          });
        },
        onCancel: (data) => {
          this.dialogMessage.openWarnDialog("Processo de pagamento cancelado.");
        },
        onError: (err) => {
          this.dialogMessage.openErrorDialog("Erro no processo de pagamento. Verifique status da assinatura no perfil, caso não tenha refletido, tente novamente mais tarde.");
        }
      }).render('#paypal-buttons-container');
    } else {
      console.error('PayPal SDK not loaded.');
      this.ngOnInit();
    }
  }

  saveSubscription(details: ResponseOnApproveData): void {
    const subscription: SubscriptionRequest = this.paymentService.mapSubscriptionDetailsToRequest(details);

    this.loadingService.startLoading();

    this.paymentService.createSubscription(subscription).then((result) => {
      this.dialogMessage.openInfoDialog("A ativação do plano será feita em breve!");
    }).catch ((error) => {
      this.dialogMessage.openErrorDialog(error.message);
    }).finally(() => {
      this.loadingService.stopLoading();
    });
  }
}
