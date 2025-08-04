import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);

// Set the entry point for Remotion
Config.setEntryPoint('./src/remotion/index.ts'); 