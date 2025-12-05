{pkgs}: {
  channel = "stable-24.05";
  packages = [
    (pkgs.nodejs_22.overrideAttrs (old: {
      version = "22.12.0";
      src = pkgs.fetchurl {
        url = "https://nodejs.org/dist/v22.12.0/node-v22.12.0-linux-x64.tar.xz";
        sha256 = "0351224f605153333469197a3989f66e017a58c634a7051a24367b3f4604a373";
      };
    }))
  ];
  idx.extensions = [
    "angular.ng-template"
  ];
  idx.previews = {
    previews = {
      web = {
        command = [
          "npm"
          "run"
          "start"
          "--"
          "--port"
          "$PORT"
          "--host"
          "0.0.0.0"
          "--disable-host-check"
        ];
        manager = "web";
      };
    };
  };
}
