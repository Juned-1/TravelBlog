import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { APIService } from 'src/apiservice.service';
import { Observable, catchError, map, throwError } from 'rxjs';

export function CanActivate(): Observable<boolean> | boolean {
  const router = inject(Router);
  const api = inject(APIService);
  console.log('here');

  return api.authorise().pipe(
    map((response: any) => {
      const res = JSON.parse(JSON.stringify(response));
      if (res.status === 'success' && res.message === 'Token verified') {
        return true;
      } else {
        console.log('Bad response');
        router.navigate(['/login']);
        return false;
      }
    }),
    catchError(() => {
      router.navigate(['/login']);
      return throwError(() => false); // Return false in case of error
    })
  );
}
