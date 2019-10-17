pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

contract WBOMB is
    ERC20,
    ERC20Burnable,
    ERC20Detailed
{
  uint8 public constant DECIMALS = 30;
  uint256 public initialSupply = (10 ** 6) * (10 ** uint256(DECIMALS));

  // The contract for the underlying token being wrapped.
  IERC20 public _baseToken;

  constructor(address _baseToken)
      public
      ERC20Detailed("Wrapped Bomb", "WBOMB", DECIMALS)
  {
    bombToken = IERC20(_baseToken)
  }

  function() public payable {
    // TODO: Revert.
  }

  function deposit(uint256 amount) external {
    // TODO: Implement.
  }

  function withdraw(uint256 amount) external {
    // TODO: Implement.
  }

  function totalSupply() public view returns (uint256) {
    return protocolToken.balanceOf(address(this));
  }

  function approve(address spender, uint256 amount) external returns (bool) {
    // TODO: Implement
  }

  function transfer(address recipient, uint256 amount) external returns (bool) {
    // TODO: Implement
  }

  function transferFrom(address sender, address recipient, uint256 amount) external returns (bool) {
    // TODO: Implement
  }

}
