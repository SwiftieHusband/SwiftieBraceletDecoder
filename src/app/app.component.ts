import { Component } from '@angular/core';
import taylorSwiftData from '../assets/taylorSwiftSongs.json';

interface Song {
  title: String;
  lyrics: String;
  album: String;
}

interface Album {  
  album: String;
  year: String;
  image: String;
  songs: any[];
}  

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentYear: number = new Date().getFullYear();

  data: Album[] = taylorSwiftData;
  userInput: string = "";
  showResults: boolean = false;
  albumResults: Album[] = [];
  songResults: Song[] = [];
  clean: Boolean = true;
  showError: boolean = false;
  errorMessage: String = "Input at least 3 characters"

  search(userInput: string): void {
    this.showError = false;
    this.albumResults = [];
    this.songResults = [];
    if (userInput.length > 2) {
      this.searchLyricsForAcronym(userInput.toLowerCase());

      if (this.songResults.length > 0 || this.albumResults.length > 0) {
        this.showResults = true;
      }
      else {
        this.showResults = false;
      }
    }
    else {
      this.showError = true;
      this.showResults = false;
    }
  }

  clear(): void {
    this.userInput = "";
    this.showResults = false;
  }

  searchLyricsForAcronym(userInput: string): void {
    this.data.forEach(album => {
      album.songs.forEach(song => {
        let lyricsFormatted = song.lyrics.replace(/[\n]/g, " ").replace(/\s+/g, " ").replace(/[.,\/#!$%\^&\*\[\];:{}=\"\'\-_`~()]/g,"").toLowerCase();
        let lyricsArray: String[] = lyricsFormatted.split(' ');
        let lyricsFirstCharacterString = "";
        lyricsArray.forEach(word => lyricsFirstCharacterString += word[0]);
        if (lyricsFirstCharacterString.includes(userInput)) {
          let firstIndex = lyricsFirstCharacterString.indexOf(userInput);
          let lastIndex = firstIndex + userInput.length;
          let snippet: String = song.lyrics.replace(/[\n]/g, " ").replace(/\s+/g, " ").split(' ').slice(firstIndex, lastIndex).join(' ');       
          const returnSong: Song = {
            title: song.title,
            lyrics: snippet,
            album: album.album
          }
          this.songResults.push(returnSong);
        }
      })
    });
  }

  searchAlbumTitles(userInput: string): void {
    this.data.filter(item => {
      if (item.album.toLowerCase().includes(userInput)) {
        this.albumResults.push(item);
      }
    });
  }
}
