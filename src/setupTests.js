// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';





body {    
    margin: 0;    
    font-family: Roboto, sans-serif;    
}    
    
mat-card {    
    max-width: 80%;    
    margin: 2em auto;    
       
}  
mat-card-title{
    text-align: center;
}  
    
mat-toolbar-row {    
    justify-content: space-between;    
} 

.container {
    display: flex;
    flex-direction: column;
  }
  
  .container > * {
    width: 100%;
  }
  .dynamic_field{
      width: 40%;
  }

.button-row{ 
    display: flex;
    flex: auto;
    justify-content: center;
}
.button-row button{
    margin-right: 8px;
}

  









<!-- Card container that binds all togather -->  
<mat-card>  
    <!-- Title of an Card -->  
    <mat-card-title>  
        Create Asset
    </mat-card-title>  
  
    <!-- Actual content starts from here -->  
    <mat-card-content>  
        <form [formGroup]="assetForm" class="container">
            <mat-form-field appearance="outline">
                <mat-label>Enter Asset Name</mat-label>
                <input matInput placeholder="Asset Name" formControlName="AssetName">
              </mat-form-field>
              <mat-form-field appearance="outline">
                    <mat-label>Enter Tag Name</mat-label>
                    <input matInput placeholder="Tag Name" formControlName="Tag">
                  </mat-form-field>
                  <mat-form-field appearance="outline">
                  <mat-label>Enter Sensor Topics</mat-label>
                  <input matInput placeholder="Sensor Topics" formControlName="Topic">
                </mat-form-field>
                
              <mat-form-field appearance="outline">
                <mat-label>Enter Scheduled Maintenance Date</mat-label>
                <input matInput placeholder="Scheduled Date" formControlName="sdate">
              </mat-form-field>
                <!-- <app-file-upload formControlName="image"></app-file-upload> -->
              <!--   <div>
                    <a href="#" data-toggle="tooltip" data-placement="right"
                      title="Enter the attributes of a participant">Dynamic Attributes</a>
                </div> -->
                <mat-label>Dynamic Attributes</mat-label>
                <div formArrayName="dynamicFields">
                        <!-- Check the correct way to iterate your form array -->
                        <div *ngFor="let itemrow of assetForm.controls['dynamicFields'].controls; let i=index"
                          [formGroupName]="i">
                          <mat-form-field appearance="outline" class="dynamic_field">
                              <mat-label>Enter Asset Field Name</mat-label>
                              <input matInput placeholder="Asset Filed Name" formControlName="assetFieldName">
                            </mat-form-field>
                            <span>&nbsp;</span>
                            <span>&nbsp;</span>
                            <mat-form-field appearance="outline" class="dynamic_field">
                                <mat-label>Enter Asset Field Value</mat-label>
                                <input matInput placeholder="Asset Field Value" formControlName="assetFieldValue">
                              </mat-form-field>
                              <span>&nbsp;</span>
                              <span>&nbsp;</span>
                              <button mat-flat-button (click)="addNewRow()" color="primary">+</button>
                              <span>&nbsp;</span>
                              <span>&nbsp;</span>
                              <button  *ngIf="assetForm.controls.dynamicFields.controls.length > 1" mat-flat-button  (click)="deleteRow(i)" color="primary">-</button>
                            <p></p>
                           <!--  <div *ngIf="participantSubmitted && itemrow.get('pattributeName').errors">
                              <p *ngIf="itemrow.get('pattributeName').errors.whitespace">space is not allowed</p>
                              <p *ngIf="itemrow.get('pattributeName').errors.required">field requirued</p> 
                            </div>-->
                           
                        </div>
                  </div>
                  <div class="button-row">
                        <button mat-raised-button color="primary" (click)="createAsset()">Create & Publish Asset</button>
                        <button mat-raised-button color="primary" (click)="resetForm()">Reset</button>
                        <button mat-raised-button color="primary">Add/Edit Rules</button>
                        <!-- <button mat-raised-button color="primary">Publish Asset</button> -->
                </div>
          </form>
    </mat-card-content>  
</mat-card>  


import { Component,OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators ,FormsModule,NgForm,FormArray } from '@angular/forms';
import { ApiService } from "../api.service";
import { MatSnackBar} from '@angular/material/snack-bar';
import { FileUploadComponent } from "../file-upload/file-upload.component";

@Component({
  selector: 'app-create-asset',
  templateUrl: './create-asset.component.html',
  styleUrls: ['./create-asset.component.css']
})
export class CreateAssetComponent implements OnInit {

  assetForm: FormGroup;
  private asset;
  @ViewChild(FileUploadComponent) private upload: FileUploadComponent;
  constructor(private fb: FormBuilder,private api:ApiService,private _snackBar: MatSnackBar ) {   
  }

  ngOnInit(){
    this.prepareForm() ;   
  }
  prepareForm(){
    this.assetForm = this.fb.group({
      AssetName: ['', Validators.required],
      Topic:['', Validators.required],
      Tag:['', Validators.required],
      image:['',Validators.required],
      sdate:['',Validators.required],
      dynamicFields:this.fb.array([this.initAssetAttributes()])    
    });

    this.upload.writeValue(null);
  }

  initAssetAttributes(){
    return this.fb.group({
      // list all your form controls here, which belongs to your form array
      assetFieldName: [''],
      assetFieldValue: [''],
     
    });
  }

  addNewRow() {
    const control = <FormArray>this.assetForm.controls['dynamicFields'];
    // add new formgroup
    control.push(this.initAssetAttributes());

  }
  deleteRow(index: number) {
    // control refers to your formarray
    const control = <FormArray>this.assetForm.controls['dynamicFields'];
    // remove the chosen row
    control.removeAt(index);
  }

  createAsset(){
    let arr=this.assetForm.value.dynamicFields;
    var arryofObj = [];
    for(var i=0;i<arr.length;i++){
       fun1(arr[i].assetFieldName,arr[i].assetFieldValue)              
    }
    function fun1(key,val){
     var o={};
     o[key] =val;
     arryofObj.push(o);
    }

    this.asset ={
      AssetName:this.assetForm.value.AssetName,
      Topic:this.assetForm.value.Topic.split(' '),
      Tag:this.assetForm.value.Tag,
      uploadedfile:this.assetForm.value.image,
      maintenanceSchedule:this.assetForm.value.sdate,
      OptionalAttributes: arryofObj
    }


    this.api.createAsset(this.toFormData(this.asset)).subscribe(res =>{
      this._snackBar.open("Asset created with hash successfully",'Undo', {
        duration: 3000,
      });
      this.assetForm.reset();
    })
 
  }

  toFormData<T>( formValue: T ) {

   
    const formData = new FormData();
   
    
  
    for ( const key of Object.keys(formValue) ) {
      const value = formValue[key];
     
      if(key === 'OptionalAttributes'){
        formData.append(key, JSON.stringify(value));
      }
      else if(key == 'uploadedfile'){
        for (let i = 0; i < value.length; i++) { 
          formData.append(key, value[i]);
        }
       }
      else{
        formData.append(key, value);
      }
     
    }
    
    return formData;
  }

  resetForm(form: FormGroup) {
    //this.prepareForm();
    this.assetForm.reset();
  }

}

