import secrets
import hashlib
import json
import os
from datetime import datetime, timedelta
from typing import Dict, Optional, List
from dataclasses import dataclass, asdict


@dataclass
class APIKey:
    """Represents an API key with metadata"""
    key_id: str
    key_hash: str
    name: str
    created_at: str
    expires_at: Optional[str]
    last_used: Optional[str]
    usage_count: int
    is_active: bool
    permissions: List[str]


class APIKeyManager:
    """Manages API key generation, storage, and validation"""

    def __init__(self, storage_file: str = "api_keys.json"):
        self.storage_file = storage_file
        self.keys: Dict[str, APIKey] = {}
        self._key_prefix = "docsum_"  # Prefix for all API keys
        self._load_keys()

    def _load_keys(self):
        """Load existing API keys from storage"""
        if os.path.exists(self.storage_file):
            try:
                with open(self.storage_file, 'r') as f:
                    data = json.load(f)
                    for key_id, key_data in data.items():
                        self.keys[key_id] = APIKey(**key_data)
            except Exception as e:
                print(f"Error loading API keys: {e}")
                self.keys = {}

    def _save_keys(self):
        """Save API keys to storage"""
        try:
            with open(self.storage_file, 'w') as f:
                data = {k: asdict(v) for k, v in self.keys.items()}
                json.dump(data, f, indent=2)
        except Exception as e:
            print(f"Error saving API keys: {e}")

    def _hash_key(self, key: str) -> str:
        """Create a hash of the API key for storage"""
        return hashlib.sha256(key.encode()).hexdigest()

    def generate_key(
        self,
        name: str = "Default Key",
        expires_days: Optional[int] = None,
        permissions: List[str] = None
    ) -> tuple[str, str]:
        """
        Generate a new API key
        Returns: (key_id, full_api_key)
        """
        # Generate unique key ID and secret
        key_id = secrets.token_urlsafe(16)
        secret = secrets.token_urlsafe(32)

        # Create full API key with prefix
        full_key = f"{self._key_prefix}{key_id}_{secret}"

        # Calculate expiration
        expires_at = None
        if expires_days:
            expires_at = (datetime.now() + timedelta(days=expires_days)).isoformat()

        # Create API key record
        api_key = APIKey(
            key_id=key_id,
            key_hash=self._hash_key(full_key),
            name=name,
            created_at=datetime.now().isoformat(),
            expires_at=expires_at,
            last_used=None,
            usage_count=0,
            is_active=True,
            permissions=permissions or ["summarize", "classify"]
        )

        # Store key metadata
        self.keys[key_id] = api_key
        self._save_keys()

        return key_id, full_key

    def validate_key(self, api_key: str) -> Optional[APIKey]:
        """
        Validate an API key
        Returns APIKey metadata if valid, None otherwise
        """
        if not api_key.startswith(self._key_prefix):
            return None

        try:
            # Extract key_id from full key
            parts = api_key.replace(self._key_prefix, "").split("_")
            if len(parts) < 2:
                return None

            key_id = parts[0]

            if key_id not in self.keys:
                return None

            key_data = self.keys[key_id]

            # Check if key is active
            if not key_data.is_active:
                return None

            # Check expiration
            if key_data.expires_at:
                if datetime.now() > datetime.fromisoformat(key_data.expires_at):
                    return None

            # Verify key hash
            if self._hash_key(api_key) != key_data.key_hash:
                return None

            # Update usage stats
            key_data.last_used = datetime.now().isoformat()
            key_data.usage_count += 1
            self._save_keys()

            return key_data

        except Exception as e:
            print(f"Error validating API key: {e}")
            return None

    def revoke_key(self, key_id: str) -> bool:
        """Revoke an API key"""
        if key_id in self.keys:
            self.keys[key_id].is_active = False
            self._save_keys()
            return True
        return False

    def delete_key(self, key_id: str) -> bool:
        """Permanently delete an API key"""
        if key_id in self.keys:
            del self.keys[key_id]
            self._save_keys()
            return True
        return False

    def get_key_info(self, key_id: str) -> Optional[Dict]:
        """Get information about a specific API key"""
        if key_id in self.keys:
            key_data = self.keys[key_id]
            return {
                "key_id": key_data.key_id,
                "name": key_data.name,
                "created_at": key_data.created_at,
                "expires_at": key_data.expires_at,
                "last_used": key_data.last_used,
                "usage_count": key_data.usage_count,
                "is_active": key_data.is_active,
                "permissions": key_data.permissions
            }
        return None

    def list_keys(self) -> List[Dict]:
        """List all API keys (without sensitive data)"""
        return [
            {
                "key_id": k.key_id,
                "name": k.name,
                "created_at": k.created_at,
                "expires_at": k.expires_at,
                "last_used": k.last_used,
                "usage_count": k.usage_count,
                "is_active": k.is_active,
                "permissions": k.permissions
            }
            for k in self.keys.values()
        ]

    def cleanup_expired_keys(self) -> int:
        """Remove expired keys and return count of removed keys"""
        now = datetime.now()
        expired_keys = []

        for key_id, key_data in self.keys.items():
            if key_data.expires_at and now > datetime.fromisoformat(key_data.expires_at):
                expired_keys.append(key_id)

        for key_id in expired_keys:
            self.keys[key_id].is_active = False

        if expired_keys:
            self._save_keys()

        return len(expired_keys)


# Global API key manager instance
api_key_manager = APIKeyManager()


def get_api_key_manager() -> APIKeyManager:
    """Get the global API key manager instance"""
    return api_key_manager
