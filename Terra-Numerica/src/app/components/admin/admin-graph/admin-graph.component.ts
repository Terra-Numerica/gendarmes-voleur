import { Component, OnInit } from '@angular/core';
import { GraphFileValidatorService } from 'src/app/_services/graph-file-validator/graph-file-validator.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-graph',
  templateUrl: './admin-graph.component.html',
  styleUrls: ['./admin-graph.component.scss']
})
export class AdminGraphComponent implements OnInit {

  public inputFile!: File;
  public fileContent: string | undefined;
  public line_in_file = 10;
  private reader!: FileReader;
  public valide_file: boolean | undefined = undefined;
  public missingProperties: any[] = [];
  public invalidProperties: any[] = [];

  constructor(private graphFileValidator: GraphFileValidatorService) { }

  ngOnInit(): void {
    this.reader = new FileReader();
  }

  fileChange(ev: any) {
    this.inputFile = ev.target.files[0];
    this.readFile();
  }

  private readFile() {
    this.reader.onload = (ev: any) => {
      this.fileContent = ev.target.result;
      this.checkFileContent();
    };

    if (this.inputFile) {
      this.reader.readAsText(this.inputFile, 'utf-8');
    } else {
      this.fileContent = undefined;
      this.valide_file = undefined;
    }
  }

  private checkFileContent() {
    console.warn('CHECKING FILE CONTENT');
    const jsonFileContent = JSON.parse(this.fileContent as string);
    this.graphFileValidator.setContentToValidate(jsonFileContent);
    this.missingProperties = this.graphFileValidator.missing_properties;
    this.invalidProperties = this.graphFileValidator.invalid_properties;
    this.valide_file = this.missingProperties.length === 0 && this.invalidProperties.length === 0;
  }

  uploadGraph() {
    if (!this.fileContent) {
      console.log('YOU MUST SELECT A FILE BEFORE UPLOADING IT');
      return;
    }

    Swal.fire({
      icon: 'info',
      title: 'Backend supprimé',
      text: 'La mise en ligne n’est plus disponible. Vous pouvez toujours valider et utiliser vos graphes localement.'
    });
  }

  isCard() {
    return this.fileContent ? 'card' : '';
  }
}