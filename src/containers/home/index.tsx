import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, web3, utils } from "@project-serum/anchor";
import { TOKEN_PROGRAM_ID, createAccount } from "@solana/spl-token";
import * as anchor from "@project-serum/anchor";

import { getOrCreateAssociatedTokenAccount } from "../../utils/transferSpl/getOrCreateAssociatedTokenAccount";

import { Idl } from "@project-serum/anchor/dist/cjs/idl";
import React, { Component, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { PublicKey } from "@solana/web3.js";
import idl from "../../idl.json";

import { constants } from "../../constants";
import { validateAddress } from "../../utils/general";
export interface EscrowData {
  randomSeed: number;
  initializerKey: PublicKey;
  initializerDepositTokenAccount: PublicKey;
  initializerAmount: Array<number>;
  admin1: PublicKey;
  resolver: PublicKey;
  admin2TokenAccount: PublicKey;
  pubkey: PublicKey;
  active: boolean;
  index: number;
}

const programID = new PublicKey(idl.metadata.address);

const Home = () => {
  const { connection } = useConnection();
  const { publicKey, wallet, signTransaction, signAllTransactions } =
    useWallet();

  const [faqNum, setFaqNum] = useState(0);
  const [stage, setStage] = useState(0);
  const [currentEscrow, setCurrentEscrow] = useState(0);

  const [escrowData, setEscrowData] = useState<EscrowData[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [myStatus, setMyStatus] = useState("active");

  const [currentMilestone, setCurrentMilestone] = useState(5);
  const [description, setDescription] = useState("");
  const [moderator, setModerator] = useState(constants.moderator);
  const [amount, setAmount] = useState(500);
  const [milestone1, setMilestone1] = useState("");
  const [amount1, setAmount1] = useState(50);
  const [milestone2, setMilestone2] = useState("");
  const [amount2, setAmount2] = useState(150);
  const [milestone3, setMilestone3] = useState("");
  const [amount3, setAmount3] = useState(200);
  const [milestone4, setMilestone4] = useState("");
  const [amount4, setAmount4] = useState(50);
  const [milestone5, setMilestone5] = useState("");
  const [amount5, setAmount5] = useState(50);

  const opts = {
    preflightCommitment: "processed",
  };

  const getProvider = () => {
    if (!wallet || !publicKey || !signTransaction || !signAllTransactions) {
      return;
    }
    const signerWallet = {
      publicKey: publicKey,
      signTransaction: signTransaction,
      signAllTransactions: signAllTransactions,
    };

    const provider = new AnchorProvider(connection, signerWallet, {
      preflightCommitment: "recent",
    });

    return provider;
  };

  const createEscrow = async () => {
    if (
      currentMilestone > 0 &&
      amount !== amount1 + amount2 + amount3 + amount4 + amount5
    ) {
      toast(
        "Set the milestone payment correctly. Must be matched to total amount!"
      );
      return;
    }
    const provider = getProvider(); //checks & verify the dapp it can able to connect solana network
    if (!provider || !publicKey || !signTransaction) return;
    const program = new Program(idl as Idl, programID, provider);

    const mint = new PublicKey(constants.mint);
    const admin1 = new PublicKey(constants.admin1);
    const admin2 = new PublicKey(constants.admin2);
    const resolver = new PublicKey(moderator);

    let admin2TokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      publicKey,
      mint,
      admin2,
      signTransaction
    );

    let initializerDepositTokenAccount =
      await getOrCreateAssociatedTokenAccount(
        connection,
        publicKey,
        mint,
        publicKey,
        signTransaction
      );

    const { adminSeed, stateSeed, vaultSeed, authoritySeed } = constants;
    const randomSeed: anchor.BN = new anchor.BN(
      Math.floor(Math.random() * 100000000)
    );

    // Derive PDAs: escrowStateKey, vaultKey, vaultAuthorityKey
    const escrowStateKey = PublicKey.findProgramAddressSync(
      [
        Buffer.from(anchor.utils.bytes.utf8.encode(stateSeed)),
        randomSeed.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    )[0];
    const vaultKey = PublicKey.findProgramAddressSync(
      [
        Buffer.from(anchor.utils.bytes.utf8.encode(vaultSeed)),
        randomSeed.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    )[0];

    try {
      //post request will verify the lib.json and using metadata address it will verify the programID and create the block in solana
      const tx = await program.transaction.initialize(
        randomSeed,
        [
          new anchor.BN(amount1),
          new anchor.BN(amount2),
          new anchor.BN(amount3),
          new anchor.BN(amount4),
          new anchor.BN(amount5),
        ],
        {
          accounts: {
            initializer: provider.wallet.publicKey,
            vault: vaultKey,
            admin1,
            resolver,
            admin2TokenAccount: admin2TokenAccount.address,
            mint,
            initializerDepositTokenAccount:
              initializerDepositTokenAccount.address,
            escrowState: escrowStateKey,
            systemProgram: anchor.web3.SystemProgram.programId,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            tokenProgram: TOKEN_PROGRAM_ID,
          },
          signers: [],
        }
      );
      tx.feePayer = provider.wallet.publicKey;
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      const signedTx = await provider.wallet.signTransaction(tx);
      const txId = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction(txId);
      setStage(0);
    } catch (err) {
      // console.log(err.message);
      console.log(err);
    }
  };

  const getEscrow = async () => {
    const provider = getProvider(); //checks & verify the dapp it can able to connect solana network
    if (!provider || !publicKey || !signTransaction) return;
    const program = new Program(idl as Idl, programID, provider);
    try {
      let tmpLockedval = 0;
      await Promise.all(
        (
          await connection.getProgramAccounts(programID)
        ).map(
          async (
            tx,
            index //no need to write smartcontract to get the data, just pulling all transaction respective programID and showing to user
          ) => {
            const fetchData: any = await program.account.escrowState.fetch(
              tx.pubkey
            );
            const newData = {
              ...fetchData,
              initializerAmount: [
                Number(fetchData.initializerAmount[0]),
                Number(fetchData.initializerAmount[1]),
                Number(fetchData.initializerAmount[2]),
                Number(fetchData.initializerAmount[3]),
                Number(fetchData.initializerAmount[4]),
              ],
              randomSeed: Number(fetchData.randomSeed),
            };
            const lockedVal =
              newData.initializerAmount[0] +
              newData.initializerAmount[1] +
              newData.initializerAmount[2] +
              newData.initializerAmount[3] +
              newData.initializerAmount[4];
            tmpLockedval += lockedVal;
            return {
              ...newData,
              pubkey: tx.pubkey.toString(),
              active: lockedVal > 0 ? true : false,
              index,
            };
          }
        )
      ).then((result) => {
        setTotalValue(tmpLockedval);
        setEscrowData(result);
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (stage === 0) getEscrow();
  }, [wallet, publicKey, signTransaction, signAllTransactions, stage]);

  useEffect(() => {
    console.log(escrowData[currentEscrow]);
  }, [currentEscrow]);

  return publicKey ? (
    <div className="bg-dashboard-backcolor min-h-[100vh] px-[49px]">
      {stage === 0 && (
        <div>
          <div className="font-[600] text-[22px] leading-[22px] pt-[107px]">
            Dashboard
          </div>
          <div className="mt-[14px] text-[18px] leading-[21px] font-[300]">
            Overview of your escrows and performance.
          </div>
          <div className="mt-[35px] grid grid-cols-3 gap-4">
            <div className="rounded-[10px] bg-dashboard-card1-bgcolor py-[23px] px-[50px]">
              <div className="flex items-center">
                <div className="bg-icon1 bg-cover w-[40px] h-[40px]" />
                <div className="ml-[14px] font-[800] text-[20px] leading-[23px]">
                  Profile Score
                </div>
              </div>
            </div>
            <div className="rounded-[10px] bg-dashboard-card1-bgcolor p-[23px]">
              <div className="flex items-center">
                <div className="bg-icon2 bg-cover w-[40px] h-[40px]" />
                <div className="ml-[14px] font-[800] text-[20px] leading-[23px]">
                  Feedback
                </div>
              </div>
            </div>
            <div className="rounded-[10px] bg-dashboard-card1-bgcolor p-[23px]">
              <div className="flex items-center">
                <div className="bg-icon3 bg-cover w-[40px] h-[40px]" />
                <div className="ml-[14px] font-[800] text-[20px] leading-[23px]">
                  Escrow Status
                </div>
              </div>
              <div className="mt-[20px]">
                <div className="flex justify-between items-center">
                  <div className="font-[300] text-[#C7C7C7] text-[14px] leading-[17px]">
                    In Escrow
                  </div>
                  <div className="text-[20px] leading-[23px] font-[800]">
                    {totalValue}
                  </div>
                </div>
                <div className="mt-[28px] flex justify-between items-center">
                  <div className="font-[300] text-[#C7C7C7] text-[14px] leading-[17px]">
                    Active
                  </div>
                  <div className="text-[20px] leading-[23px] font-[800]">
                    {
                      escrowData.filter((escrow) => {
                        return escrow.active === true;
                      }).length
                    }
                  </div>
                </div>
                <div className="mt-[28px] flex justify-between items-center">
                  <div className="font-[300] text-[#C7C7C7] text-[14px] leading-[17px]">
                    Completed
                  </div>
                  <div className="text-[20px] leading-[23px] font-[800]">
                    {
                      escrowData.filter((escrow) => {
                        return escrow.active === false;
                      }).length
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-[51.37px] border-b-[2px] border-[#7c98a9] opacity-[0.4] h-0"></div>
          <div className="mt-[35.63px] flex justify-between items-center">
            <div className="flex items-center">
              <div className="font-[600] text-[22px] leading-[26px]">
                My Escrows
              </div>
              <div
                className="ml-[32px] rounded-[10px] w-[115px] h-[35px] flex justify-center items-center bg-dashboard-button1-bgcolor font-[600] text-[18px] leading-[21px] cursor-pointer"
                onClick={() => {
                  if (wallet) {
                    setStage(1);
                  } else toast("Please connect wallet");
                }}
              >
                CREATE
              </div>
            </div>
            <div className="rounded-[20px] bg-dashboard-buttonwrapper-bgcolor w-[246px] h-[42px] p-[3px] flex justify-between items-center">
              <div
                className={
                  myStatus === "active"
                    ? "w-[115.69px] h-[35px] flex justify-center items-center bg-dashboard-button1-bgcolor text-[18px] leading-[22px] font-[500] rounded-[20px] cursor-pointer"
                    : "w-[115.69px] h-[35px] flex justify-center items-center hover:bg-dashboard-button1-bgcolor text-[18px] leading-[22px] font-[500] rounded-[20px] cursor-pointer"
                }
                onClick={() => setMyStatus("active")}
              >
                Active
              </div>
              <div
                className={
                  myStatus === "completed"
                    ? "w-[115.69px] h-[35px] flex justify-center items-center bg-dashboard-button1-bgcolor text-[18px] leading-[22px] font-[500] rounded-[20px] cursor-pointer"
                    : "w-[115.69px] h-[35px] flex justify-center items-center hover:bg-dashboard-button1-bgcolor text-[18px] leading-[22px] font-[500] rounded-[20px] cursor-pointer"
                }
                onClick={() => setMyStatus("completed")}
              >
                Completed
              </div>
            </div>
          </div>
          <div className="mt-[46px] pb-[177px] grid grid-cols-3 gap-4">
            {escrowData
              .filter((escrow) => {
                if (myStatus === "active")
                  return (
                    escrow.initializerKey.toString() === publicKey.toString() &&
                    escrow.active === true
                  );
                if (myStatus === "completed")
                  return (
                    escrow.initializerKey.toString() === publicKey.toString() &&
                    escrow.active === false
                  );
              })
              .map((myEscrow, idx) => {
                return (
                  <div
                    key={idx}
                    className="rounded-[10px] bg-dashboard-card2-bgcolor"
                  >
                    <div
                      className={
                        idx % 3 === 0
                          ? `bg-dashboard-card2-interior1-bgcolor p-[23px] rounded-[10px]`
                          : `bg-dashboard-card2-interior2-bgcolor p-[23px] rounded-[10px]`
                      }
                    >
                      <div className="flex items-center">
                        <div className="bg-icon4 bg-cover w-[40px] h-[40px]" />
                        <div className="ml-[14px]">
                          <div className="text-[#ADADAD] font-[300] text-[10px] leading-[12px]">{`Escrow #${myEscrow.randomSeed}`}</div>
                          <div className="font-[500] text-[20px] leading-[23px]">
                            Escrow Status
                          </div>
                        </div>
                      </div>
                      <div className="mt-[20px]">
                        <div className="flex justify-between items-center">
                          <div className="font-[300] text-[#C7C7C7] text-[14px] leading-[17px]">
                            Amount
                          </div>
                          <div className="text-[20px] leading-[23px] font-[800]">
                            {`$ ${
                              myEscrow.initializerAmount[0] +
                              myEscrow.initializerAmount[1] +
                              myEscrow.initializerAmount[2] +
                              myEscrow.initializerAmount[3] +
                              myEscrow.initializerAmount[4]
                            }`}
                          </div>
                        </div>
                      </div>
                      <div className="mt-[20px]">
                        <div className="flex justify-between items-center">
                          <div className="font-[300] text-[#C7C7C7] text-[14px] leading-[17px]">
                            Status
                          </div>
                          <div className="text-[20px] leading-[23px] font-[800]">
                            {myEscrow.active ? "In progress" : "Completed"}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row-reverse py-[12px] px-[23px] items-center">
                      <div
                        className="bg-link bg-cover w-[12px] h-[12px] cursor-pointer"
                        onClick={() => {
                          setCurrentEscrow(myEscrow.index);
                          setStage(2);
                        }}
                      />
                      <div className="font-[500] text-[16px] leading-[19px] mr-[10px]">
                        View Escrow
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
      {stage === 1 && (
        <div className="pb-[249px]">
          <div className="flex items-center">
            <div className="font-[600] text-[22px] leading-[22px] pt-[107px]">
              Create Escrow
            </div>
          </div>
          <div className="mt-[14px] text-[18px] leading-[21px] font-[300]">
            Create a new escrow and protect your payments.
          </div>
          <div className="mt-[35px] grid grid-cols-2 gap-4">
            <div className="pt-[23px] pr-[23px]">
              <div className="flex justify-between items-center">
                <div className="w-[110px] text-[20px]">Description</div>
                <input
                  type="text"
                  className="w-[330px] h-[40px] px-[12px] rounded-[5px] border-[1px] border-[#7C98A9] bg-input-box-bgcolor"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              {/* <div className="mt-[30px] flex justify-between items-center">
                <div className="w-[110px] text-[20px]">Receiver</div>
                <input
                  type="text"
                  className="w-[330px] h-[40px] px-[12px] rounded-[5px] border-[1px] border-[#7C98A9] bg-input-box-bgcolor"
                  value={receiver}
                  onChange={(e) => setReceiver(e.target.value)}
                />
              </div> */}
              <div className="mt-[50px] flex justify-between items-center">
                <div className="w-[110px] text-[20px]">Moderator</div>
                <input
                  type="text"
                  className="w-[330px] h-[40px] px-[12px] rounded-[5px] border-[1px] border-[#7C98A9] bg-input-box-bgcolor"
                  value={moderator}
                  onChange={(e) => setModerator(e.target.value)}
                />
              </div>
              <div className="mt-[50px] flex justify-between items-center">
                <div className="w-[110px] text-[20px]">Amount</div>
                <input
                  type="text"
                  className="w-[330px] h-[40px] px-[12px] rounded-[5px] border-[1px] border-[#7C98A9] bg-input-box-bgcolor"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </div>
              <div className="mt-[104.37px] border-b-[2px] border-[#7c98a9] opacity-[0.4] h-0"></div>
            </div>
            <div className="rounded-[10px] bg-fee-panel-bgcolor p-[23px] px-[43px]">
              <div className="font-[800] text-[32px] leading-[38px]">Fees</div>
              <div className="mt-[43px] flex justify-between items-center">
                <div className="text-[20px] leading-[23px">
                  Platform fee(5%)
                </div>
                <div className="text-[20px] font-[600]">50 USDC</div>
              </div>
              <div className="mt-[37px] flex justify-between items-center">
                <div className="text-[20px] leading-[23px">
                  Holder Discount (1%)
                </div>
                <div className="text-[20px] font-[600]">10 USDC</div>
              </div>
              <div className="mt-[41px] border-b-[2px] border-[#7c98a9] opacity-[0.4] h-0"></div>
              <div className="mt-[25px] flex justify-between items-center">
                <div className="text-[20px] leading-[23px">Total</div>
                <div className="text-[20px] font-[600]">1040 USDC</div>
              </div>
            </div>
          </div>
          <div className="mt-[47px] grid grid-cols-2 gap-4">
            <div className="pr-[23px]">
              <div className="flex justify-between items-center">
                <div className="w-[110px] text-[20px]">Milestones</div>
                <div className="flex">
                  <div
                    className="w-[110px] h-[40px] mr-[30px] px-[12px] rounded-[5px] bg-[#7C98A9] flex justify-center items-center font-[800] text-[18px] leading-[21px] cursor-pointer"
                    onClick={() => {
                      if (currentMilestone < 5)
                        setCurrentMilestone(currentMilestone + 1);
                      else toast("Max milestone number is 5");
                    }}
                  >
                    ADD +
                  </div>
                  <div
                    className="w-[110px] h-[40px] mr-[80px] px-[12px] rounded-[5px] bg-[#7C98A9] flex justify-center items-center font-[800] text-[18px] leading-[21px] cursor-pointer"
                    onClick={() => setCurrentMilestone(0)}
                  >
                    Reset
                  </div>
                </div>
              </div>
              {currentMilestone > 0 && (
                <div>
                  <div className="mt-[36px] flex justify-between items-center">
                    <div className="w-[110px] text-[20px]">Milestone 1</div>
                    <input
                      type="text"
                      className="w-[330px] h-[40px] px-[12px] rounded-[5px] border-[1px] border-[#7C98A9] bg-input-box-bgcolor"
                      value={milestone1}
                      onChange={(e) => setMilestone1(e.target.value)}
                    />
                  </div>
                  <div className="mt-[30px] flex justify-between items-center">
                    <div className="w-[110px] text-[20px]">Amount</div>
                    <input
                      type="text"
                      className="w-[330px] h-[40px] px-[12px] rounded-[5px] border-[1px] border-[#7C98A9] bg-input-box-bgcolor"
                      value={amount1}
                      onChange={(e) => setAmount1(Number(e.target.value))}
                    />
                  </div>
                </div>
              )}
              {currentMilestone > 1 && (
                <div>
                  <div className="mt-[36px] flex justify-between items-center">
                    <div className="w-[110px] text-[20px]">Milestone 2</div>
                    <input
                      type="text"
                      className="w-[330px] h-[40px] px-[12px] rounded-[5px] border-[1px] border-[#7C98A9] bg-input-box-bgcolor"
                      value={milestone2}
                      onChange={(e) => setMilestone2(e.target.value)}
                    />
                  </div>
                  <div className="mt-[30px] flex justify-between items-center">
                    <div className="w-[110px] text-[20px]">Amount</div>
                    <input
                      type="text"
                      className="w-[330px] h-[40px] px-[12px] rounded-[5px] border-[1px] border-[#7C98A9] bg-input-box-bgcolor"
                      value={amount2}
                      onChange={(e) => setAmount2(Number(e.target.value))}
                    />
                  </div>
                </div>
              )}
              {currentMilestone > 2 && (
                <div>
                  <div className="mt-[36px] flex justify-between items-center">
                    <div className="w-[110px] text-[20px]">Milestone 3</div>
                    <input
                      type="text"
                      className="w-[330px] h-[40px] px-[12px] rounded-[5px] border-[1px] border-[#7C98A9] bg-input-box-bgcolor"
                      value={milestone3}
                      onChange={(e) => setMilestone3(e.target.value)}
                    />
                  </div>
                  <div className="mt-[30px] flex justify-between items-center">
                    <div className="w-[110px] text-[20px]">Amount</div>
                    <input
                      type="text"
                      className="w-[330px] h-[40px] px-[12px] rounded-[5px] border-[1px] border-[#7C98A9] bg-input-box-bgcolor"
                      value={amount3}
                      onChange={(e) => setAmount3(Number(e.target.value))}
                    />
                  </div>
                </div>
              )}
              {currentMilestone > 3 && (
                <div>
                  <div className="mt-[36px] flex justify-between items-center">
                    <div className="w-[110px] text-[20px]">Milestone 4</div>
                    <input
                      type="text"
                      className="w-[330px] h-[40px] px-[12px] rounded-[5px] border-[1px] border-[#7C98A9] bg-input-box-bgcolor"
                      value={milestone4}
                      onChange={(e) => setMilestone4(e.target.value)}
                    />
                  </div>
                  <div className="mt-[30px] flex justify-between items-center">
                    <div className="w-[110px] text-[20px]">Amount</div>
                    <input
                      type="text"
                      className="w-[330px] h-[40px] px-[12px] rounded-[5px] border-[1px] border-[#7C98A9] bg-input-box-bgcolor"
                      value={amount4}
                      onChange={(e) => setAmount4(Number(e.target.value))}
                    />
                  </div>
                </div>
              )}
              {currentMilestone > 4 && (
                <div>
                  <div className="mt-[36px] flex justify-between items-center">
                    <div className="w-[110px] text-[20px]">Milestone 5</div>
                    <input
                      type="text"
                      className="w-[330px] h-[40px] px-[12px] rounded-[5px] border-[1px] border-[#7C98A9] bg-input-box-bgcolor"
                      value={milestone5}
                      onChange={(e) => setMilestone5(e.target.value)}
                    />
                  </div>
                  <div className="mt-[30px] flex justify-between items-center">
                    <div className="w-[110px] text-[20px]">Amount</div>
                    <input
                      type="text"
                      className="w-[330px] h-[40px] px-[12px] rounded-[5px] border-[1px] border-[#7C98A9] bg-input-box-bgcolor"
                      value={amount5}
                      onChange={(e) => setAmount5(Number(e.target.value))}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-row">
              <div
                className="w-[120px] h-[40px] px-[12px] rounded-[5px] bg-[#7C98A9] flex justify-center items-center font-[800] text-[18px] leading-[21px] cursor-pointer"
                onClick={createEscrow}
              >
                CREATE
              </div>
              <div
                className="ml-[30px] w-[120px] h-[40px] px-[12px] rounded-[5px] bg-[#7C98A9] flex justify-center items-center font-[800] text-[18px] leading-[21px] cursor-pointer"
                onClick={() => {
                  setStage(0);
                }}
              >
                CANCEL
              </div>
            </div>
          </div>
        </div>
      )}
      {/* {stage === 2 && <div>sss{console.log(escrowData[currentEscrow])}</div>} */}
    </div>
  ) : (
    <div className="bg-dashboard-backcolor min-h-[100vh] px-[49px]"></div>
  );
};
export default Home;
