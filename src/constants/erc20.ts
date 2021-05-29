import { Interface } from '@ethersproject/abi';
import { abi as ERC20_ABI } from '../abi/TestToken.json';
import { abi as ERC20_BYTES32_ABI } from '../abi/BTokenBytes32.json';

const ERC20_INTERFACE = new Interface(ERC20_ABI);

const ERC20_BYTES32_INTERFACE = new Interface(ERC20_BYTES32_ABI);

export default ERC20_INTERFACE;
export { ERC20_ABI, ERC20_BYTES32_INTERFACE, ERC20_BYTES32_ABI };
