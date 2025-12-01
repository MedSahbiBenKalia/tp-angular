import { Component, OnInit, Signal, inject } from '@angular/core';
import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APP_ROUTES } from '../../../config/routes.config';
import { AuthService } from '../../auth/services/auth.service';

import { DefaultImagePipe } from '../pipes/default-image.pipe';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, switchMap, tap } from 'rxjs';

@Component({
    selector: 'app-details-cv',
    templateUrl: './details-cv.component.html',
    styleUrls: ['./details-cv.component.css'],
    standalone: true,
    imports: [DefaultImagePipe],
})
export class DetailsCvComponent implements OnInit {
  private cvService = inject(CvService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private toastr = inject(ToastrService);
  authService = inject(AuthService);

  paramsSignal = toSignal(this.activatedRoute.params, { initialValue: {} as Params });

  // !!!!! Use the signal in rxResource request !!!!!!
  cvResource = rxResource({
    request: () => this.paramsSignal(),
    loader: ({ request }) => {
      console.log("params received rxResouce", request);
      const id = request['id'];
      if (!id) {
        return of(null);
      }
      return this.cvService.getCvById(+id).pipe(
        catchError(() => {
          this.router.navigate(["master-detail-cv"]);
          return of(null);
        })
      );
    }
  });

  cv= this.cvResource.value;



  ngOnInit() {
  }

   

  deleteCv(cv: Cv) {
    this.cvService.deleteCvById(cv.id).subscribe({
      next: () => {
        this.cvService.CvResource.reload();
        this.toastr.success(`${cv.name} supprimé avec succès`);
        this.router.navigate([APP_ROUTES.cv]);
      },
      error: () => {
        this.toastr.error(
          `Problème avec le serveur veuillez contacter l'admin`
        );
      },
    });
  }
}
