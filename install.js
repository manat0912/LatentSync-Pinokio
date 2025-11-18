module.exports = {
  requires: {
    bundle: "ai"
  },
  run: [
    {
      method: "shell.run",
      params: {
        message: "git clone https://github.com/bytedance/LatentSync app"
      }
    },
    {
      method: "script.start",
      params: {
        uri: "torch.js",
        params: {
          venv: "env",
          path: "app",
          xformers: true,
          triton: true
        }
      }
    },
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        env: {
          HF_TOKEN: "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",
          HUGGINGFACE_HUB_TOKEN: "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"
        },
        message: [
          "uv pip install -r ../requirements.txt"
        ]
      }
    },
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: "hf download ByteDance/LatentSync-1.6 latentsync_unet.pt --local-dir checkpoints"
      }
    },
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: "hf download ByteDance/LatentSync-1.6 whisper/tiny.pt --local-dir checkpoints"
      }
    }
  ]
}