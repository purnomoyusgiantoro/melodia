// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract MusicRoyalty {

    string public name;
    string public symbol;
    uint8 public constant decimals = 18;
    uint256 public totalSupply;

    struct MusicInfo {
        string title;
        string artist;
        uint256 totalRoyaltyValue;
        uint256 totalShares;
        string legalDocument;
        bool isActive;
    }

    MusicInfo public music;

    address public admin;
    address public kycRegistry;

    mapping(address => bool) public frozen;
    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowances;

    uint256 public maxHolding = 1000 ether;

    // =========================
    // NEW: Price per share for demo
    // =========================
    uint256 public pricePerShare = 0.01 ether;

    // =========================
    // EVENTS
    // =========================
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event AccountFrozen(address indexed account, string reason);
    event AccountUnfrozen(address indexed account);
    event MusicUpdated(string title, uint256 totalRoyaltyValue);
    event SharesPurchased(address indexed buyer, uint256 amount, uint256 totalCost);

    // =========================
    // MODIFIERS
    // =========================
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier notFrozen(address _account) {
        require(!frozen[_account], "Account is frozen");
        _;
    }

    modifier onlyVerified(address _account) {
        require(_isVerified(_account), "Not KYC verified");
        _;
    }

    // For demo: allow everyone to buy
    modifier onlyVerifiedOrDemo(address _account) {
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol,
        address _kycRegistry,
        string memory _title,
        string memory _artist,
        uint256 _totalRoyaltyValue,
        uint256 _totalShares
    ) {
        require(_kycRegistry != address(0), "Invalid KYC registry");

        name = _name;
        symbol = _symbol;
        admin = msg.sender;
        kycRegistry = _kycRegistry;

        music = MusicInfo({
            title: _title,
            artist: _artist,
            totalRoyaltyValue: _totalRoyaltyValue,
            totalShares: _totalShares,
            legalDocument: "",
            isActive: true
        });

        totalSupply = _totalShares;
        balances[msg.sender] = _totalShares;

        emit Transfer(address(0), msg.sender, _totalShares);
    }

    // =========================
    // STANDARD FUNCTIONS
    // =========================
    function balanceOf(address _owner) public view returns (uint256) {
        return balances[_owner];
    }

    function transfer(
        address _to,
        uint256 _value
    )
        public
        notFrozen(msg.sender)
        notFrozen(_to)
        onlyVerified(msg.sender)
        onlyVerified(_to)
        returns (bool)
    {
        require(balances[msg.sender] >= _value, "Insufficient balance");
        require(balances[_to] + _value <= maxHolding, "Exceeds max holding");

        balances[msg.sender] -= _value;
        balances[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool) {
        allowances[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    )
        public
        notFrozen(_from)
        notFrozen(_to)
        onlyVerified(_from)
        onlyVerified(_to)
        returns (bool)
    {
        require(balances[_from] >= _value, "Insufficient balance");
        require(allowances[_from][msg.sender] >= _value, "Insufficient allowance");

        balances[_from] -= _value;
        balances[_to] += _value;
        allowances[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);
        return true;
    }

    function freezeAccount(address _account, string calldata _reason)
        external
        onlyAdmin
    {
        frozen[_account] = true;
        emit AccountFrozen(_account, _reason);
    }

    function unfreezeAccount(address _account) external onlyAdmin {
        frozen[_account] = false;
        emit AccountUnfrozen(_account);
    }

    function forceTransfer(
        address _from,
        address _to,
        uint256 _value
    ) external onlyAdmin {
        balances[_from] -= _value;
        balances[_to] += _value;
        emit Transfer(_from, _to, _value);
    }

    function setLegalDocument(string calldata _ipfsHash) external onlyAdmin {
        music.legalDocument = _ipfsHash;
    }

    // =========================
    // NEW: Buy Shares Function
    // =========================
    function buyShares(uint256 _amount) external payable notFrozen(msg.sender) onlyVerifiedOrDemo(msg.sender) {
        require(_amount > 0, "Amount must be > 0");
        uint256 totalCost = _amount * pricePerShare;
        require(msg.value >= totalCost, "Insufficient ETH sent");
        require(balances[admin] >= _amount, "Not enough shares available");

        balances[admin] -= _amount;
        balances[msg.sender] += _amount;

        emit Transfer(admin, msg.sender, _amount);
        emit SharesPurchased(msg.sender, _amount, totalCost);

        // Refund kelebihan ETH
        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost);
        }
    }

    function setPricePerShare(uint256 _price) external onlyAdmin {
        pricePerShare = _price;
    }

    // =========================
    // INTERNAL
    // =========================
    function _isVerified(address _account) internal view returns (bool) {
        if (_account == admin) return true;

        (bool success, bytes memory data) = kycRegistry.staticcall(
            abi.encodeWithSignature("isVerified(address)", _account)
        );

        if (!success) return false;
        return abi.decode(data, (bool));
    }
}
