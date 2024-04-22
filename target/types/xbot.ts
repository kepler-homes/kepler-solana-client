export type Xbot = {
  "version": "0.0.1",
  "name": "xbot",
  "constants": [
    {
      "name": "CLAIM_USER_SEED",
      "type": "string",
      "value": "\"ClaimUser\""
    },
    {
      "name": "XBOT_SEED",
      "type": "string",
      "value": "\"XBot\""
    },
    {
      "name": "LAND_USER_SEED",
      "type": "string",
      "value": "\"LandUser\""
    },
    {
      "name": "PET_SEED",
      "type": "string",
      "value": "\"Pet\""
    },
    {
      "name": "PET_USER_SEED",
      "type": "string",
      "value": "\"PetUser\""
    },
    {
      "name": "LENDING_SEED",
      "type": "string",
      "value": "\"Lending\""
    },
    {
      "name": "VALUT_SEED",
      "type": "string",
      "value": "\"Vault\""
    },
    {
      "name": "LENDING_USER_SEED",
      "type": "string",
      "value": "\"LendingUser\""
    }
  ],
  "instructions": [
    {
      "name": "createToken",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "xbotAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadataAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "symbol",
          "type": "string"
        },
        {
          "name": "uri",
          "type": "string"
        }
      ]
    },
    {
      "name": "mintToken",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "xbotAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tokenName",
          "type": "string"
        },
        {
          "name": "mintAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createCollection",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "xbotAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadataAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "masterEdition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "symbol",
          "type": "string"
        },
        {
          "name": "uri",
          "type": "string"
        }
      ]
    },
    {
      "name": "claimToken",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "xbotAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "claimId",
          "type": "u64"
        },
        {
          "name": "expireAt",
          "type": "u64"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "signature",
          "type": {
            "array": [
              "u8",
              64
            ]
          }
        }
      ]
    },
    {
      "name": "petBuy",
      "accounts": [
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "xbotAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "storePetId",
          "type": "u64"
        },
        {
          "name": "currency",
          "type": "publicKey"
        },
        {
          "name": "price",
          "type": "u64"
        },
        {
          "name": "referrer",
          "type": "publicKey"
        },
        {
          "name": "signature",
          "type": {
            "array": [
              "u8",
              64
            ]
          }
        }
      ]
    },
    {
      "name": "petUpgrade",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "xbotAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "userPetId",
          "type": "u64"
        },
        {
          "name": "targetLevel",
          "type": "u64"
        },
        {
          "name": "currency",
          "type": "publicKey"
        },
        {
          "name": "price",
          "type": "u64"
        },
        {
          "name": "referrer",
          "type": "publicKey"
        },
        {
          "name": "signature",
          "type": {
            "array": [
              "u8",
              64
            ]
          }
        }
      ]
    },
    {
      "name": "foodBuy",
      "accounts": [
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "xbotAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "storeFoodId",
          "type": "u64"
        },
        {
          "name": "currency",
          "type": "publicKey"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "price",
          "type": "u64"
        },
        {
          "name": "referrer",
          "type": "publicKey"
        },
        {
          "name": "signature",
          "type": {
            "array": [
              "u8",
              64
            ]
          }
        }
      ]
    },
    {
      "name": "landUpgrade",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "xbotAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "landUserAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "targetLevel",
          "type": "u64"
        },
        {
          "name": "currency",
          "type": "publicKey"
        },
        {
          "name": "price",
          "type": "u64"
        },
        {
          "name": "referrer",
          "type": "publicKey"
        },
        {
          "name": "signature",
          "type": {
            "array": [
              "u8",
              64
            ]
          }
        }
      ]
    },
    {
      "name": "petInitialize",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "petAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "petMint",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "xbotAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "petAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionMetadataAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionMasterEdition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadataAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "masterEdition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "collectionName",
          "type": "string"
        },
        {
          "name": "userPetId",
          "type": "u64"
        },
        {
          "name": "signature",
          "type": {
            "array": [
              "u8",
              64
            ]
          }
        }
      ]
    },
    {
      "name": "lendingInitialize",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "lendingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "price",
          "type": "u64"
        }
      ]
    },
    {
      "name": "lendingInitializeVault",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "xbotAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "lendingUpdate",
      "accounts": [
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "lendingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "price",
          "type": "u64"
        }
      ]
    },
    {
      "name": "lendingBorrow",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "lendingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solVaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tokenAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "lendingRepay",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "solVaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lendingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tokenAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "emergencyWithdrawSol",
      "accounts": [
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "xbotAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solVaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipientAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK, receive sol"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "emergencyWithdrawToken",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "xbotAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipientAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK, receive sol"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initializeXbot",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "xbotAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "signer",
          "type": "publicKey"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "claimUserAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lastClaimId",
            "type": "u64"
          },
          {
            "name": "lastClaimTime",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "landUserAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "level",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "lendingAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "admin",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "lendingUserAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokenAmount",
            "type": "u64"
          },
          {
            "name": "solAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "petUserAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "referrer",
            "type": "publicKey"
          },
          {
            "name": "nftMint",
            "type": "publicKey"
          },
          {
            "name": "nftId",
            "type": "u64"
          },
          {
            "name": "mintTime",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "petAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nextTokenId",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "xbotAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "signer",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "ClaimTokenEvent",
      "fields": [
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "mint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "claimId",
          "type": "u64",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "FoodBuyEvent",
      "fields": [
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "storeFoodId",
          "type": "u64",
          "index": false
        },
        {
          "name": "currency",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "price",
          "type": "u64",
          "index": false
        },
        {
          "name": "referrer",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "LandUpgradeEvent",
      "fields": [
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "targetLevel",
          "type": "u64",
          "index": false
        },
        {
          "name": "currency",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "price",
          "type": "u64",
          "index": false
        },
        {
          "name": "referrer",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "LendingBorrowEvent",
      "fields": [
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "currency",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "solAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "LendingRepayEvent",
      "fields": [
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "currency",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "solAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "PetBuyEvent",
      "fields": [
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "storePetId",
          "type": "u64",
          "index": false
        },
        {
          "name": "currency",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "price",
          "type": "u64",
          "index": false
        },
        {
          "name": "referrer",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "PetMintEvent",
      "fields": [
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "userPetId",
          "type": "u64",
          "index": false
        },
        {
          "name": "tokenId",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "PetUpgradeEvent",
      "fields": [
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "userPetId",
          "type": "u64",
          "index": false
        },
        {
          "name": "targetLevel",
          "type": "u64",
          "index": false
        },
        {
          "name": "currency",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "price",
          "type": "u64",
          "index": false
        },
        {
          "name": "referrer",
          "type": "publicKey",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidTokenAmount",
      "msg": "invalid token amount"
    },
    {
      "code": 6001,
      "name": "InvalidSignature",
      "msg": "invalid signature."
    },
    {
      "code": 6002,
      "name": "InvalidLevel",
      "msg": "invalid level."
    },
    {
      "code": 6003,
      "name": "DuplicateClaim",
      "msg": "duplicate claim."
    },
    {
      "code": 6004,
      "name": "ClaimIdExpired",
      "msg": "claim id expired."
    },
    {
      "code": 6005,
      "name": "InsufficientWaitTime",
      "msg": "insufficient wait time."
    },
    {
      "code": 6006,
      "name": "InvalidAccess",
      "msg": "invalid access"
    }
  ]
};

export const IDL: Xbot = {
  "version": "0.0.1",
  "name": "xbot",
  "constants": [
    {
      "name": "CLAIM_USER_SEED",
      "type": "string",
      "value": "\"ClaimUser\""
    },
    {
      "name": "XBOT_SEED",
      "type": "string",
      "value": "\"XBot\""
    },
    {
      "name": "LAND_USER_SEED",
      "type": "string",
      "value": "\"LandUser\""
    },
    {
      "name": "PET_SEED",
      "type": "string",
      "value": "\"Pet\""
    },
    {
      "name": "PET_USER_SEED",
      "type": "string",
      "value": "\"PetUser\""
    },
    {
      "name": "LENDING_SEED",
      "type": "string",
      "value": "\"Lending\""
    },
    {
      "name": "VALUT_SEED",
      "type": "string",
      "value": "\"Vault\""
    },
    {
      "name": "LENDING_USER_SEED",
      "type": "string",
      "value": "\"LendingUser\""
    }
  ],
  "instructions": [
    {
      "name": "createToken",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "xbotAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadataAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "symbol",
          "type": "string"
        },
        {
          "name": "uri",
          "type": "string"
        }
      ]
    },
    {
      "name": "mintToken",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "xbotAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tokenName",
          "type": "string"
        },
        {
          "name": "mintAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createCollection",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "xbotAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadataAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "masterEdition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "symbol",
          "type": "string"
        },
        {
          "name": "uri",
          "type": "string"
        }
      ]
    },
    {
      "name": "claimToken",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "xbotAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "claimId",
          "type": "u64"
        },
        {
          "name": "expireAt",
          "type": "u64"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "signature",
          "type": {
            "array": [
              "u8",
              64
            ]
          }
        }
      ]
    },
    {
      "name": "petBuy",
      "accounts": [
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "xbotAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "storePetId",
          "type": "u64"
        },
        {
          "name": "currency",
          "type": "publicKey"
        },
        {
          "name": "price",
          "type": "u64"
        },
        {
          "name": "referrer",
          "type": "publicKey"
        },
        {
          "name": "signature",
          "type": {
            "array": [
              "u8",
              64
            ]
          }
        }
      ]
    },
    {
      "name": "petUpgrade",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "xbotAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "userPetId",
          "type": "u64"
        },
        {
          "name": "targetLevel",
          "type": "u64"
        },
        {
          "name": "currency",
          "type": "publicKey"
        },
        {
          "name": "price",
          "type": "u64"
        },
        {
          "name": "referrer",
          "type": "publicKey"
        },
        {
          "name": "signature",
          "type": {
            "array": [
              "u8",
              64
            ]
          }
        }
      ]
    },
    {
      "name": "foodBuy",
      "accounts": [
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "xbotAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "storeFoodId",
          "type": "u64"
        },
        {
          "name": "currency",
          "type": "publicKey"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "price",
          "type": "u64"
        },
        {
          "name": "referrer",
          "type": "publicKey"
        },
        {
          "name": "signature",
          "type": {
            "array": [
              "u8",
              64
            ]
          }
        }
      ]
    },
    {
      "name": "landUpgrade",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "xbotAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "landUserAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "targetLevel",
          "type": "u64"
        },
        {
          "name": "currency",
          "type": "publicKey"
        },
        {
          "name": "price",
          "type": "u64"
        },
        {
          "name": "referrer",
          "type": "publicKey"
        },
        {
          "name": "signature",
          "type": {
            "array": [
              "u8",
              64
            ]
          }
        }
      ]
    },
    {
      "name": "petInitialize",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "petAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "petMint",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "xbotAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "petAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionMetadataAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionMasterEdition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadataAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "masterEdition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "collectionName",
          "type": "string"
        },
        {
          "name": "userPetId",
          "type": "u64"
        },
        {
          "name": "signature",
          "type": {
            "array": [
              "u8",
              64
            ]
          }
        }
      ]
    },
    {
      "name": "lendingInitialize",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "lendingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "price",
          "type": "u64"
        }
      ]
    },
    {
      "name": "lendingInitializeVault",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "xbotAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "lendingUpdate",
      "accounts": [
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "lendingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "price",
          "type": "u64"
        }
      ]
    },
    {
      "name": "lendingBorrow",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "lendingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solVaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tokenAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "lendingRepay",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "solVaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lendingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tokenAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "emergencyWithdrawSol",
      "accounts": [
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "xbotAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solVaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipientAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK, receive sol"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "emergencyWithdrawToken",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "xbotAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipientAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK, receive sol"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initializeXbot",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "xbotAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "signer",
          "type": "publicKey"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "claimUserAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lastClaimId",
            "type": "u64"
          },
          {
            "name": "lastClaimTime",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "landUserAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "level",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "lendingAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "admin",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "lendingUserAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokenAmount",
            "type": "u64"
          },
          {
            "name": "solAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "petUserAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "referrer",
            "type": "publicKey"
          },
          {
            "name": "nftMint",
            "type": "publicKey"
          },
          {
            "name": "nftId",
            "type": "u64"
          },
          {
            "name": "mintTime",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "petAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nextTokenId",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "xbotAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "signer",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "ClaimTokenEvent",
      "fields": [
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "mint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "claimId",
          "type": "u64",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "FoodBuyEvent",
      "fields": [
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "storeFoodId",
          "type": "u64",
          "index": false
        },
        {
          "name": "currency",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "price",
          "type": "u64",
          "index": false
        },
        {
          "name": "referrer",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "LandUpgradeEvent",
      "fields": [
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "targetLevel",
          "type": "u64",
          "index": false
        },
        {
          "name": "currency",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "price",
          "type": "u64",
          "index": false
        },
        {
          "name": "referrer",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "LendingBorrowEvent",
      "fields": [
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "currency",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "solAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "LendingRepayEvent",
      "fields": [
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "currency",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "solAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "PetBuyEvent",
      "fields": [
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "storePetId",
          "type": "u64",
          "index": false
        },
        {
          "name": "currency",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "price",
          "type": "u64",
          "index": false
        },
        {
          "name": "referrer",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "PetMintEvent",
      "fields": [
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "userPetId",
          "type": "u64",
          "index": false
        },
        {
          "name": "tokenId",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "PetUpgradeEvent",
      "fields": [
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "userPetId",
          "type": "u64",
          "index": false
        },
        {
          "name": "targetLevel",
          "type": "u64",
          "index": false
        },
        {
          "name": "currency",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "price",
          "type": "u64",
          "index": false
        },
        {
          "name": "referrer",
          "type": "publicKey",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidTokenAmount",
      "msg": "invalid token amount"
    },
    {
      "code": 6001,
      "name": "InvalidSignature",
      "msg": "invalid signature."
    },
    {
      "code": 6002,
      "name": "InvalidLevel",
      "msg": "invalid level."
    },
    {
      "code": 6003,
      "name": "DuplicateClaim",
      "msg": "duplicate claim."
    },
    {
      "code": 6004,
      "name": "ClaimIdExpired",
      "msg": "claim id expired."
    },
    {
      "code": 6005,
      "name": "InsufficientWaitTime",
      "msg": "insufficient wait time."
    },
    {
      "code": 6006,
      "name": "InvalidAccess",
      "msg": "invalid access"
    }
  ]
};
