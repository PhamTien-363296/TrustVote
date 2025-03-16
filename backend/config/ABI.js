const ABI = 
[
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_hoVaTen",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_id",
				"type": "string"
			}
		],
		"name": "addCandidate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "hoVaTen",
				"type": "string"
			}
		],
		"name": "CandidateAdded",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "candidateCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "candidates",
		"outputs": [
			{
				"internalType": "string",
				"name": "hoVaTen",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_id",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "voteCount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllCandidates",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "hoVaTen",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "_id",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "voteCount",
						"type": "uint256"
					}
				],
				"internalType": "struct Election.Candidate[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_candidateId",
				"type": "string"
			}
		],
		"name": "getCandidate",
		"outputs": [
			{
				"internalType": "string",
				"name": "hoVaTen",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "candidateIdStr",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "voteCount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

export default ABI;