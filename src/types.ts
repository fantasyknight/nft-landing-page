export type AnchorEscrow = {
  version: "0.1.0";
  name: "anchor_escrow";
  instructions: [
    {
      name: "initialize";
      accounts: [
        {
          name: "initializer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "admin1";
          isMut: true;
          isSigner: false;
        },
        {
          name: "resolver";
          isMut: true;
          isSigner: false;
        },
        {
          name: "admin2TokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "vault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "initializerDepositTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "escrowState";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "randomSeed";
          type: "u64";
        },
        {
          name: "initializerAmount";
          type: {
            array: ["u64", 5];
          };
        }
      ];
    },
    {
      name: "cancel";
      accounts: [
        {
          name: "initializer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "vault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "vaultAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "resolverDepositTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "escrowState";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "approve";
      accounts: [
        {
          name: "initializer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "takerReceiveTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "initializerDepositTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "escrowState";
          isMut: true;
          isSigner: false;
        },
        {
          name: "vault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "vaultAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "milestoneIdx";
          type: "u64";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "escrowState";
      type: {
        kind: "struct";
        fields: [
          {
            name: "randomSeed";
            type: "u64";
          },
          {
            name: "initializerKey";
            type: "publicKey";
          },
          {
            name: "initializerDepositTokenAccount";
            type: "publicKey";
          },
          {
            name: "initializerAmount";
            type: {
              array: ["u64", 5];
            };
          },
          {
            name: "admin1";
            type: "publicKey";
          },
          {
            name: "resolver";
            type: "publicKey";
          },
          {
            name: "admin2TokenAccount";
            type: "publicKey";
          }
        ];
      };
    }
  ];
};

export const IDL: AnchorEscrow = {
  version: "0.1.0",
  name: "anchor_escrow",
  instructions: [
    {
      name: "initialize",
      accounts: [
        {
          name: "initializer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "admin1",
          isMut: true,
          isSigner: false,
        },
        {
          name: "resolver",
          isMut: true,
          isSigner: false,
        },
        {
          name: "admin2TokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "vault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "initializerDepositTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "escrowState",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "randomSeed",
          type: "u64",
        },
        {
          name: "initializerAmount",
          type: {
            array: ["u64", 5],
          },
        },
      ],
    },
    {
      name: "cancel",
      accounts: [
        {
          name: "initializer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "vault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "vaultAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "resolverDepositTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "escrowState",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "approve",
      accounts: [
        {
          name: "initializer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "takerReceiveTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "initializerDepositTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "escrowState",
          isMut: true,
          isSigner: false,
        },
        {
          name: "vault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "vaultAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "milestoneIdx",
          type: "u64",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "escrowState",
      type: {
        kind: "struct",
        fields: [
          {
            name: "randomSeed",
            type: "u64",
          },
          {
            name: "initializerKey",
            type: "publicKey",
          },
          {
            name: "initializerDepositTokenAccount",
            type: "publicKey",
          },
          {
            name: "initializerAmount",
            type: {
              array: ["u64", 5],
            },
          },
          {
            name: "admin1",
            type: "publicKey",
          },
          {
            name: "resolver",
            type: "publicKey",
          },
          {
            name: "admin2TokenAccount",
            type: "publicKey",
          },
        ],
      },
    },
  ],
};
