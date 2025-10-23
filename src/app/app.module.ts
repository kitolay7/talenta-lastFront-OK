import { NgModule } from '@angular/core';
import { Routes, RouterModule, UrlTree  } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule, BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TextFieldModule } from '@angular/cdk/text-field';


import { HeaderModule } from './components/header/header.module';
import { HomeModule } from './components/home/home.module';

import { MatFormFieldModule } from '@angular/material/form-field';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { TestComponent } from './components/test/test.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ToastrModule } from 'ngx-toastr';
import { AjoutOffreComponent } from './components/ajout-offre/ajout-offre.component';
import { MenuComponent } from './components/menu/menu.component';
import { AccountComponent } from './components/account/account.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { CreateTestComponent } from './components/create-test/create-test.component';
import { RecordComponent } from './components/record/record.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ListingProjetComponent } from './components/listing-projet/listing-projet.component';
import { DetailOfferRecruteurComponent } from './components/detail-offer-recruteur/detail-offer-recruteur.component';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { TesterComponent } from './components/tester/tester.component';
import { LoginRecruteurComponent } from './components/user/recruteur/login-recruteur/login-recruteur.component';
import { RegistrationRecruteurComponent } from './components/user/recruteur/registration-recruteur/registration-recruteur.component';
import { RegistrationCandidatComponent } from './components/user/candidat/registration-candidat/registration-candidat.component';
import { LoginCandidatComponent } from './components/user/candidat/login-candidat/login-candidat.component';
import { ProfileFormCandidatComponent } from './components/profile/profile-form-candidat/profile-form-candidat.component';
import { ProfileFormRecruteurComponent } from './components/profile/profile-form-recruteur/profile-form-recruteur.component';
import { OptiontesterComponent } from './components/optiontester/optiontester.component';
import { FichePosteComponent } from './fiche-poste/fiche-poste.component';
import { AuthGuard } from './guard/auth.guard';
import { GestionCandidatsComponent } from './components/gestion-candidats/gestion-candidats.component';
import { DetailCandidatComponent } from './components/detail-candidat/detail-candidat.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';


import { AuthInterceptor } from './interceptor/httpconfig.interceptor';
import { PostulationComponent } from './components/dashboard/postulation/postulation.component';
import { environment } from '../../src/environments/environment';
import { from } from 'rxjs';
import { MenuCandidatComponent } from './components/menu-candidat/menu-candidat.component';
import { MenuArchiverComponent } from './components/menu-archiver/menu-archiver.component';
import { DetailFolderComponent } from './components/detail-folder/detail-folder.component';
import { ProjectEditComponent } from './components/project-edit/project-edit.component';
import { ListSpontaneousComponent } from './components/user/candidat-spontaneous/list-spontaneous/list-spontaneous.component';
import { DetailSpontaneousComponent } from './components/user/candidat-spontaneous/detail-spontaneous/detail-spontaneous.component';
import { SubheaderComponent } from './components/subheader/subheader.component';
import { BanqueCvComponent } from './components/user/candidat-spontaneous/banque-cv/banque-cv.component';
import { EditPassComponent } from './components/edit-pass/edit-pass.component';
import { ListingOffreCandidatComponent } from './components/listing-offre-candidat/listing-offre-candidat.component';
import { MainNotationComponent } from './components/main-notation/main-notation.component';
import { ResetComponent } from './components/user/reset/reset.component';
import { ConfirmationComponent } from './components/user/confirmation/confirmation.component';
import { ProfileComponent } from './components/user/recruteur/profile/profile.component';
import { ITS_JUST_ANGULAR } from '@angular/core/src/r3_symbols';
//import { AppRoutingModule } from './app-routing.module';
import { AdminGuard } from './guards/admin.guard';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import {HeaderAdminAuthComponent} from './components/admin-login/header-admin-auth/header-admin-auth.component';
import {HeaderAdminComponent} from './components/admin-login/header-admin/header-admin.component';
import { AdminAuthService } from './services/admin-auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

/*
export const adminGuard = (): boolean | UrlTree => {
  const auth = inject(AdminAuthService);
  const router = inject(Router);
  // Autoriser le panel uniquement si connecté
  return auth.isLoggedIn() || router.parseUrl('/admin-login');
};

export const adminLoginGuard = (): boolean | UrlTree => {
  const auth = inject(AdminAuthService);
  const router = inject(Router);
  // Autoriser la page de login uniquement si NON connecté
  return !auth.isLoggedIn() || router.parseUrl('/administration');
};
*/

const config: SocketIoConfig = { url: environment.baseUrl, options: {} };
const appRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  { path: 'candidat/registration', component: RegistrationCandidatComponent },
  { path: 'candidat/login', component: LoginCandidatComponent },
  { path: 'candidat/profile', component: ProfileFormCandidatComponent, canActivate: [AuthGuard] },
  { path: 'recruteur/registration', component: RegistrationRecruteurComponent },
  { path: 'recruteur/login', component: LoginCandidatComponent },
  { path: 'recruteur/profile', component: ProfileFormRecruteurComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'quiz/:id', component: QuizComponent, canActivate: [AuthGuard] },
  { path: 'test', component: TestComponent, canActivate: [AuthGuard] },
  { path: 'ajout-offre', component: AjoutOffreComponent, canActivate: [AuthGuard] },
  { path: 'myaccount', component: AccountComponent, canActivate: [AuthGuard] },
  { path: 'create-test', component: CreateTestComponent, canActivate: [AuthGuard] },
  { path: 'record', component: RecordComponent },
  { path: 'projet', component: ListingProjetComponent, canActivate: [AuthGuard] },
  { path: 'detail_offer/:idOffer', component: DetailOfferRecruteurComponent, canActivate: [AuthGuard] },
  { path: 'project/:id/edit', component: ProjectEditComponent, canActivate: [AuthGuard] },
  { path: 'gestion_candidats', component: GestionCandidatsComponent, canActivate: [AuthGuard] },
  { path: 'detail_candidat/:idCandidat', component: DetailCandidatComponent, canActivate: [AuthGuard] },
  { path: 'offre/:offreId/users', component: PostulationComponent, canActivate: [AuthGuard] },
  { path: 'optiontester', component: OptiontesterComponent, canActivate: [AuthGuard] },
  { path: 'tester/:id', component: TesterComponent, canActivate: [AuthGuard] },
  { path: 'listingArchiver', component: MenuArchiverComponent, canActivate: [AuthGuard] },
  { path: "user/recruteur/profile", component: ProfileComponent, canActivate: [AuthGuard] },

  { path: 'detail_folder/:idFolder', component: DetailFolderComponent, canActivate: [AuthGuard] },
  { path: 'postuler/:idOffer/fichedeposte', component: FichePosteComponent, canActivate: [AuthGuard] },
  { path: 'listingSpontaneous', component: ListSpontaneousComponent, canActivate: [AuthGuard] },
  { path: 'banqueCV', component: BanqueCvComponent, canActivate: [AuthGuard] },
  { path: 'detail_spontaneous/:idCandidat', component: DetailSpontaneousComponent, canActivate: [AuthGuard] },
  { path: 'editpassword', component: EditPassComponent, canActivate: [AuthGuard] },
  { path: 'offreCandidat', component: ListingOffreCandidatComponent, canActivate: [AuthGuard] },
  { path: 'postulation/users/:userId/offres/:offreId/details', component: MainNotationComponent, canActivate: [AuthGuard] },
  { path: 'user/reset/:token', component: ResetComponent },
  { path: 'confirmation/:token/:role', component: ConfirmationComponent },
  { path: 'administration', component: AdminPanelComponent },
  { path: 'admin-login', component: AdminLoginComponent },
  
  {
    path: '**',
    component: HomeComponent,
  },
  
];
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    FooterComponent,
    TestComponent,
    AjoutOffreComponent,
    MenuComponent,
    AccountComponent,
    LoadingSpinnerComponent,
    CreateTestComponent,
    RecordComponent,
    AccountComponent,
    ListingProjetComponent,
    DetailOfferRecruteurComponent,
    QuizComponent,
    HeaderComponent,
    TesterComponent,
    OptiontesterComponent,
    FichePosteComponent,
    LoginRecruteurComponent,
    RegistrationRecruteurComponent,
    RegistrationCandidatComponent,
    LoginCandidatComponent,
    ProfileFormCandidatComponent,
    ProfileFormRecruteurComponent,
    GestionCandidatsComponent,
    DetailCandidatComponent,
    PostulationComponent,
    MenuCandidatComponent,
    MenuArchiverComponent,
    DetailFolderComponent,
    ProjectEditComponent,
    ListSpontaneousComponent,
    DetailSpontaneousComponent,
    SubheaderComponent,
    BanqueCvComponent,
    EditPassComponent,
    ListingOffreCandidatComponent,
    MainNotationComponent,
    ResetComponent,
    ConfirmationComponent,
    ProfileComponent,
    AppComponent,
    AdminLoginComponent,
    AdminPanelComponent,
    HeaderAdminAuthComponent,
    HeaderAdminComponent
    
  ],
  imports: [
    HomeModule,
    HeaderModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    ToastrModule.forRoot(),
    HttpClientModule,
    RouterModule.forRoot(appRoutes, {
      scrollPositionRestoration: 'top',
      onSameUrlNavigation: 'reload',
      anchorScrolling: 'enabled',
      useHash: true,
    }),

    BrowserAnimationsModule,
    NgxPaginationModule,
    BsDropdownModule.forRoot(),
    MatTooltipModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    TextFieldModule,
    Ng2SearchPipeModule,
    MatCheckboxModule,
    DragDropModule,
    CKEditorModule,
    IvyCarouselModule,
    SocketIoModule.forRoot(config),
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [HttpClient, BsModalService, BsModalRef, AuthGuard, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  }],

  bootstrap: [AppComponent]
})
export class AppModule { }
RouterModule.forRoot(appRoutes, { useHash: true })
