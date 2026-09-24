export interface CodeExample {
  id: string;
  title: string;
  description: string;
  filename: string;
  code: string;
  simulatedOutput: string;
  compileTimeMs: number;
  memoryMb: number;
}

export interface ReleaseAsset {
  id: string;
  name: string;
  filename: string;
  platform: 'windows' | 'macos' | 'linux' | 'cli';
  architecture: string;
  size: string;
  sha256: string;
  type: 'installer' | 'portable' | 'toolchain';
  description: string;
  recommended?: boolean;
}
