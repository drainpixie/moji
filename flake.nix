{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    hooks = {
      url = "github:cachix/git-hooks.nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = {
    self,
    nixpkgs,
    hooks,
  }: let
    supportedSystems = ["x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin"];

    forEachSupportedSystem = f:
      nixpkgs.lib.genAttrs supportedSystems (system:
        f {
          pkgs = nixpkgs.legacyPackages.${system};
          inherit system;
        });
  in {
    devShells = forEachSupportedSystem ({
      pkgs,
      system,
    }: {
      default = pkgs.mkShell {
        inherit (self.checks.${system}.pre-commit) shellHook;

        packages =
          builtins.attrValues {
            inherit (pkgs.nodePackages) nodejs pnpm typescript typescript-language-server;
          }
          ++ self.checks.${system}.pre-commit.enabledPackages;
      };
    });

    checks = forEachSupportedSystem ({
      pkgs,
      system,
    }: {
      pre-commit = hooks.lib.${system}.run {
        src = ./.;

        hooks = {
          eslint = {
            enable = true;
            entry = "pnpx eslint";
            files = "\\.(ts|js|tsx|jsx|svelte)$";
          };

          prettier = {
            enable = true;
            excludes = ["flake.lock"];
          };

          convco.enable = true;
          alejandra.enable = true;
        };
      };
    });

    formatter = forEachSupportedSystem ({pkgs, ...}: pkgs.alejandra);
  };
}
