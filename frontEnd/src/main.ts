import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication, provideProtractorTestingSupport } from '@angular/platform-browser';
import { RouteReuseStrategy} from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import routeConfig from './app/routes';
import { APIService } from './apiservice.service';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';


// if (environment.production) {
//   enableProdMode();
// }

bootstrapApplication(AppComponent, {
  providers: [
    //{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    importProvidersFrom(IonicModule.forRoot({})),
    provideAnimations(),
    provideAnimations(),
    provideProtractorTestingSupport(),
      provideRouter(routeConfig),
      APIService, importProvidersFrom(HttpClientModule),
      ToastrService, importProvidersFrom(ToastrModule.forRoot({
        positionClass : 'toast-bottom-right',
        timeOut : 3000,
        closeButton : true,
      })),
      {
        provide: 'SocialAuthServiceConfig',
        useValue: {
          autoLogin: false,
          providers: [
            {
              id: GoogleLoginProvider.PROVIDER_ID,
              provider: new GoogleLoginProvider(
                '457194816818-lsd5pocegjv37tnistemfn5sm7c82pca.apps.googleusercontent.com'
              )
            },
          ],
          onError: (err) => {
            console.error(err);
          }
        } as SocialAuthServiceConfig,
      }
],

});