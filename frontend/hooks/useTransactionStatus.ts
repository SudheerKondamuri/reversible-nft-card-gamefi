'use client';

import { useState, useCallback } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { type TransactionStatus } from '@/types/contracts';
import { BaseError, ContractFunctionRevertedError } from 'viem';

/**
 * Parse revert reasons from contract errors into human-readable messages
 */
function parseContractError(error: Error): string {
    if (error instanceof BaseError) {
        const revertError = error.walk((err) => err instanceof ContractFunctionRevertedError);
        if (revertError instanceof ContractFunctionRevertedError) {
            const reason = revertError.data?.errorName || revertError.reason;
            const errorMessages: Record<string, string> = {
                'Invalid combination': 'These two cards cannot be combined. Check if they are locked, same token, or at max generation.',
                'Not owner': 'You do not own one or more of the selected cards.',
                'Cooldown active': 'You must wait for the cooldown period to end before combining again.',
                'Insufficient fuel provided': 'Higher rarity combinations require Common cards as fuel.',
                'Fuel must be Common': 'Only Common rarity cards can be used as combination fuel.',
                'Not a valid fused card': 'This card is not currently fused and cannot be unfused.',
                'Card is locked in escrow': 'This card is locked and cannot be transferred.',
            };
            return errorMessages[reason || ''] || reason || 'Transaction was reverted by the contract.';
        }
        // User rejected
        if (error.message.includes('User rejected') || error.message.includes('user rejected')) {
            return 'Transaction was cancelled by the user.';
        }
    }
    return error.message || 'An unknown error occurred.';
}

export function useTransactionStatus() {
    const [status, setStatus] = useState<TransactionStatus>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleError = useCallback((error: Error) => {
        setStatus('failed');
        setErrorMessage(parseContractError(error));
    }, []);

    const reset = useCallback(() => {
        setStatus('idle');
        setErrorMessage(null);
    }, []);

    return {
        status,
        setStatus,
        errorMessage,
        setErrorMessage,
        handleError,
        reset,
        parseContractError,
    };
}
