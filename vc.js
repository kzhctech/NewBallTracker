const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const inputPath = 'screenshots/images';
const outputPath = 'screenshots/output.mp4';
const fps = 30;

// Get a list of all image files in the input directory
const files = fs.readdirSync(inputPath).filter(file => {
  return file.endsWith('.jpg') || file.endsWith('.png');
});

// Generate a list of input arguments for FFmpeg
const args = [
  '-y',
  '-framerate', fps,
  '-i', path.join(inputPath, '%*.jpg'),
  '-c:v', 'libx264',
  '-pix_fmt', 'yuv420p',
  '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
  '-r', fps,
  outputPath
];

// Spawn an FFmpeg process to convert the images to a video
const ffmpeg = spawn('ffmpeg', args);

ffmpeg.on('exit', () => {
  console.log('Video conversion complete!');
});
