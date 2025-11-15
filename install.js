module.exports = async (kernel) => {
  return {
    run: [
      // Edit this step to customize the git repository to use
      {
        method: "shell.run",
        params: {
          message: [
          "git clone https://github.com/bytedance/LatentSync app",
        ]
      }
    },
    // Delete this step if your project does not use torch
    {
      method: "script.start",
      params: {
        uri: "torch.js",
        params: {
          venv: "env",                // Edit this to customize the venv folder path
          path: "app",                // Edit this to customize the path to start the shell from
          xformers: true   // uncomment this line if your project requires xformers
        }
      }
    },
    {
      method: "shell.run",
      params: {
        venv: "env",                // Edit this to customize the venv folder path
        path: "app",                // Edit this to customize the path to start the shell from
        env: {
          HF_TOKEN: "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",
          HUGGINGFACE_HUB_TOKEN: "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"
        },
        message: [
          "python.exe -m pip install --upgrade pip setuptools wheel",
          "pip install -r requirements.txt",
          "pip install --force-reinstall \"huggingface-hub==0.28.1\" \"filelock>=3.13,<4\"",
          // Explicitly pin diffusers/transformers used by the app
          "pip install --force-reinstall diffusers==0.25.1 transformers==4.41.1",
          "pip install --force-reinstall \"pillow<12.0,>=8.0\"",
          //"pip install -r requirements.txt",
          // Download all the checkpoints from HuggingFace
          "huggingface-cli download ByteDance/LatentSync-1.6 latentsync_unet.pt --local-dir checkpoints",
          "huggingface-cli download ByteDance/LatentSync-1.6 whisper/tiny.pt --local-dir checkpoints"
        ]
      }
    },
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: [
          "pip install --upgrade --force-reinstall numpy==1.26.3"
        ]
      }
    },
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: [
          "pip list"
        ]
      }
    },
    {
      when: "true",
      method: "shell.run",
      params: {
        venv: "env",                // Edit this to customize the venv folder path
        path: "app",                // Edit this to customize the path to start the shell from
        message: [
          // Install OpenCV Dependencies
          "pip install opencv-python-headless==4.9.0.80"
        ]
      }
    },
    {
      when: "true",
      method: "shell.run",
      params: {
        venv: "env",                // Edit this to customize the venv folder path
        path: "app",                // Edit this to customize the path to start the shell from
        ignore_errors: true,
        message: [
          // Install Triton
          "pip install https://github.com/woct0rdho/triton-windows/releases/download/v3.1.0-windows.post8/triton-3.1.0-cp310-cp310-win_amd64.whl"
        ]
      }
    },
    {
      when: "{{platform === 'darwin'}}",
      method: "shell.run",
      params: {
        message: [
          "brew install ffmpeg"
        ]
      }
    },
    {
      when: "{{platform === 'linux'}}",
      method: "shell.run",
      params: {
        message: [
          "sudo apt-get update",
          "sudo apt-get install -y ffmpeg"
        ]
      }
    },
        {
          when: "{{platform === 'linux' || platform === 'darwin'}}",
          method: "shell.run",
          params: {
            path: "app",
            message: [
              "mkdir -p {{homedir}}/.cache/torch/hub/checkpoints",
              "ln -sf {{cwd}}/checkpoints/auxiliary/2DFAN4-cd938726ad.zip {{homedir}}/.cache/torch/hub/checkpoints/2DFAN4-cd938726ad.zip",
              "ln -sf {{cwd}}/checkpoints/auxiliary/s3fd-619a316812.pth {{homedir}}/.cache/torch/hub/checkpoints/s3fd-619a316812.pth",
              "ln -sf {{cwd}}/checkpoints/auxiliary/vgg16-397923af.pth {{homedir}}/.cache/torch/hub/checkpoints/vgg16-397923af.pth"
            ]
          }
        },
        {
          when: "{{platform === 'win32'}}",
          method: "shell.run",
          params: {
            path: "app",
            message: [
              // Torch checkpoints
              "powershell -Command \"New-Item -ItemType Directory -Force -Path '{{homedir}}\ .cache\torch\hub\checkpoints'\"",
              "powershell -Command \"Copy-Item -Path '{{cwd}}\checkpoints\auxiliary\2DFAN4-cd938726ad.zip' -Destination '{{homedir}}\ .cache\torch\hub\checkpoints\2DFAN4-cd938726ad.zip'\"",
              "powershell -Command \"Copy-Item -Path '{{cwd}}\checkpoints\auxiliary\s3fd-619a316812.pth' -Destination '{{homedir}}\ .cache\torch\hub\checkpoints\s3fd-619a316812.pth'\"",
              "powershell -Command \"Copy-Item -Path '{{cwd}}\checkpoints\auxiliary\vgg16-397923af.pth' -Destination '{{homedir}}\ .cache\torch\hub\checkpoints\vgg16-397923af.pth'\"",

              // FFmpeg binary + license
              "powershell -Command \"New-Item -ItemType Directory -Force -Path '{{homedir}}\ .cache\ffmpeg\bin'\"",
              "powershell -Command \"Copy-Item -Path '{{cwd}}\bin\ffmpeg.exe' -Destination '{{homedir}}\ .cache\ffmpeg\bin\ffmpeg.exe'\"",
              "powershell -Command \"Copy-Item -Path '{{cwd}}\bin\ffprobe.exe' -Destination '{{homedir}}\ .cache\ffmpeg\bin\ffprobe.exe'\"",
              "powershell -Command \"Copy-Item -Path '{{cwd}}\bin\LICENSE.txt' -Destination '{{homedir}}\ .cache\ffmpeg\bin\LICENSE.txt'\""
            ]
          }
        },
        {
          method: "shell.run",
          params: {
            path: ".",
            message: [
              "node create_symlinks.js"
            ]
          }
        },
        {
          method: "fs.link",
          params: {
            venv: "app/env"
          }
        }
    ]
  }
}