import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import { Observable, of, switchMap } from "rxjs";
import { APIService } from "src/apiservice.service";
@Injectable({
    providedIn : 'root'
})
export class Authguard implements CanActivate{
    constructor(private api : APIService,private router  : Router){}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        if(route.data['userType'] === 'guest'){
          return true;
        } else {
          const isLoggedSubject = new Observable<boolean>((subscriber) => {
            this.api.authorise().subscribe((response : any) => {
              //console.log(response);
              const res = JSON.parse(JSON.stringify(response));
              if (res.status === 'success' && res.message === "Token verified") {
                subscriber.next(true);
              } else {
                subscriber.next(false);
              }
            },
            (err) => {
              subscriber.next(false);
            }
            );
          });
          return isLoggedSubject.pipe(
            switchMap((isLogged) => {
              if (route.data["userType"] === "guest") {
                return of(true);
              } else if (route.data["userType"] === "non-loggedin") {
                if (isLogged) {
                  return of(false);
                } else {
                  return of(true);
                }
              } else if (route.data["userType"] === "logged-in" && isLogged) {
                return of(true);
              } else {
                this.router.navigate(["/"]);
                return of(false);
              }
            })
          );
        }
    }
}