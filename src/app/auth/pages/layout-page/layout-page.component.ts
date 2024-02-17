import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SignUpComponent } from '../../components/sign-up/sign-up.component';
import { SignInComponent } from '../../components/sign-in/sign-in.component';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrls: ['./layout-page.component.css'],
})
export class LayoutPageComponent { 

  public dialog = inject(MatDialog);

  openDialog(): void {
    const dialogRef = this.dialog.open(SignUpComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

  openDialogSignIn(): void {
    const dialogRef = this.dialog.open(SignInComponent);
  }

}
