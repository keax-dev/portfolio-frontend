import { CanActivateFn, Router } from '@angular/router';
import { UserInfoService } from '@app/shared/services/user-info.service';
import { AlertService } from '@app/shared/services/alert.service';
import { inject } from '@angular/core';

export const HomeGuard: CanActivateFn = () => {

  const userInfoService = inject(UserInfoService);
  const alertService = inject(AlertService);
  const router = inject(Router);

  if (userInfoService.getToken && userInfoService.getTimeExpiration !== 0) {
    return true;
  }

  alertService.warning("Unauthorized");
  router.navigateByUrl("/");
  return false;

};

