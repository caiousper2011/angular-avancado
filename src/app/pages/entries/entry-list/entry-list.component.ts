import { Entry } from './../shared/models/entry.model';
import { EntryService } from './../shared/services/entry.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css'],
})
export class EntryListComponent implements OnInit {
  entries: Entry[] = [];
  constructor(private entryService: EntryService) {}

  ngOnInit(): void {
    this.entryService.getAll().subscribe(
      (entries) => (this.entries = entries.sort((a, b) => b.id - a.id)),
      (error) => console.log('Erro ao carregar Lista', error)
    );
  }

  deleteEntry(entry): void {
    const mustDelete = confirm('Deseja realmente excluir este item?');
    if (!mustDelete) return;
    this.entryService.delete(entry.id).subscribe(
      () => (this.entries = this.entries.filter((item) => item != entry)),
      (error) => console.log('Erro ao tentar excluir', error)
    );
  }
}
