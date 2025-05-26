{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    utils.url = "github:numtide/flake-utils";
    hooks.url = "github:cachix/git-hooks.nix";
  };

  outputs = {
    self,
    utils,
    hooks,
    nixpkgs,
  }:
    utils.lib.eachDefaultSystem (
      system: let
        pkgs = import nixpkgs {inherit system;};
        check = self.checks.${system}.pre-commit-check;
      in {
        devShell = pkgs.mkShell {
          inherit (check) shellHook;
          packages =
            builtins.attrValues {
              inherit (pkgs) nodejs_latest;
              inherit (pkgs.nodePackages_latest) pnpm vercel;
            }
            ++ check.enabledPackages;
        };

        checks = {
          pre-commit-check = hooks.lib.${system}.run {
            src = ./.;
            hooks = {
              convco.enable = true;
              prettier.enable = true;
              alejandra.enable = true;
            };
          };
        };
      }
    );
}
