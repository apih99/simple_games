// Background music URLs - using direct MP3 files that are more reliable
export const GAME_MUSIC = {
  menu: 'https://dl.dropboxusercontent.com/s/h4ztw6qnqwttxyn/menu.mp3',
  snake: 'https://dl.dropboxusercontent.com/s/hv1tqxlpt9gn0fa/snake.mp3',
  tetris: 'https://dl.dropboxusercontent.com/s/h7wxu7c5k3bz0y7/tetris.mp3',
  flappyBird: 'https://dl.dropboxusercontent.com/s/jazkbmwvps6dl7f/flappybird.mp3',
  ticTacToe: 'https://dl.dropboxusercontent.com/s/gy9xwsn5srh0671/tictactoe.mp3'
};

class AudioManager {
  private static instance: AudioManager;
  private audio: HTMLAudioElement | null = null;
  private currentGame: string = '';
  private volume: number = 0.3;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;

  private constructor() {
    // Pre-load all audio files
    Object.values(GAME_MUSIC).forEach(url => {
      const audio = new Audio();
      audio.src = url;
      audio.load();
    });
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public async playGameMusic(game: keyof typeof GAME_MUSIC): Promise<void> {
    try {
      if (this.currentGame === game && this.isPlaying) return;

      // Stop current audio if playing
      if (this.audio) {
        this.audio.pause();
        this.audio = null;
      }

      // Create and configure new audio
      this.audio = new Audio(GAME_MUSIC[game]);
      this.audio.volume = this.volume;
      this.audio.loop = true;
      this.audio.muted = this.isMuted;

      // Play audio with user interaction handling
      try {
        await this.audio.play();
        this.isPlaying = true;
      } catch (error) {
        console.log('Audio playback requires user interaction first');
        // Add event listener for first user interaction
        const playOnInteraction = async () => {
          try {
            if (this.audio) {
              await this.audio.play();
              this.isPlaying = true;
              document.removeEventListener('click', playOnInteraction);
              document.removeEventListener('keydown', playOnInteraction);
            }
          } catch (error) {
            console.error('Failed to play audio:', error);
          }
        };

        document.addEventListener('click', playOnInteraction);
        document.addEventListener('keydown', playOnInteraction);
      }

      this.currentGame = game;
    } catch (error) {
      console.error('Error playing game music:', error);
    }
  }

  public stopMusic(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
      this.isPlaying = false;
    }
  }

  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
  }

  public toggleMute(): void {
    this.isMuted = !this.isMuted;
    if (this.audio) {
      this.audio.muted = this.isMuted;
    }
  }

  public isAudioPlaying(): boolean {
    return this.isPlaying;
  }

  public isMutedState(): boolean {
    return this.isMuted;
  }
}

export const audioManager = AudioManager.getInstance();
