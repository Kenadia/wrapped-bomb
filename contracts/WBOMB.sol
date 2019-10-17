pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

/**
 * SafeMath implementation used by the base BOMBv3 contract.
 */
library BombV3SafeMath {
  using SafeMath for uint256;

  /**
   * Return `a` rounded up to the nearest multiple of `m`.
   */
  function ceil(uint256 a, uint256 m) internal pure returns (uint256) {
    return a.add(m).sub(1).div(m).mul(m);
  }
}

/**
 * ERC-20 token which wraps BOMBv3 and keeps it from exploding.
 */
contract WBOMB is
    ERC20Burnable,
    ERC20Detailed
{
  using BombV3SafeMath for uint256;

  uint8 public constant DECIMALS = 30;
  uint256 public constant CONVERSION_RATE = (10 ** uint256(DECIMALS));

  // The `basePercent` constant used by the BOMBv3 contract.
  uint256 private constant bombV3BasePercent = 100;

  // The contract for the underlying BOMBv3 token being wrapped.
  IERC20 public baseToken;

  constructor(address _baseToken)
      public
      ERC20Detailed("Wrapped Bomb", "WBOMB", DECIMALS)
  {
    baseToken = IERC20(_baseToken);
  }

  function() external payable {
    revert();
  }

  /**
   * Replicate the BOMBv3 logic to get the amount received in a transfer.
   *
   * 1% of the tokens transfered will self-destruct, so we return the other 99%.
   */
  function getAmountReceived(uint256 amount) internal pure returns (uint256) {
    uint256 roundedValue = amount.ceil(bombV3BasePercent);
    uint256 onePercent = roundedValue.mul(bombV3BasePercent).div(10000);
    return amount.sub(onePercent);
  }

  function deposit(uint256 baseAmount) external {
    baseToken.transferFrom(msg.sender, address(this), baseAmount);
    uint256 baseAmountReceived = getAmountReceived(baseAmount);
    uint256 wrappedAmountReceived = baseAmountReceived.mul(CONVERSION_RATE);
    _mint(msg.sender, wrappedAmountReceived);
  }

  function withdraw(uint256 baseAmount) external {
    baseToken.transfer(msg.sender, baseAmount);
    uint256 wrappedAmount = baseAmount.mul(CONVERSION_RATE);
    _burn(msg.sender, wrappedAmount);
  }

  /**
   * Returns the amount of BOMBv3 held by the contract.
   *
   * Should always correspond exactly to the WBOMB total supply.
   */
  function baseTokenSupply() external view returns (uint256) {
    return baseToken.balanceOf(address(this));
  }
}
