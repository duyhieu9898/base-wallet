import { ethers } from 'ethers';

export function encodeParameters(types: any[], values: any[]): string {
  const abi = new ethers.utils.AbiCoder();
  return abi.encode(types, values);
}

export function decodeParameters(types: any[], data: string): any[] {
  const abi = new ethers.utils.AbiCoder();
  return abi.decode(types, data);
}
