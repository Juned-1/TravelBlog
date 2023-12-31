import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication, provideProtractorTestingSupport } from '@angular/platform-browser';
import { RouteReuseStrategy} from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import routeConfig from './app/routes';
import { APIService } from './apiservice.service';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule, ToastrService } from 'ngx-toastr';


if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(IonicModule.forRoot({})),
    provideAnimations(),
    provideAnimations(),
    provideProtractorTestingSupport(),
      provideRouter(routeConfig),
      APIService, importProvidersFrom(HttpClientModule),
      ToastrService, importProvidersFrom(ToastrModule.forRoot({
        positionClass : 'toast-top-right',
        timeOut : 3000,
        closeButton : true,
      }))
],
});
