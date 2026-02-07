# app/data/__init__.py

from app.data.legal_rules import (
    IPC_420_RULES,
    MONEY_DISPUTE_CLASSIFICATION,
    ASSET_TYPE_RULES,
    THREAT_CLASSIFICATION,
    validate_ipc_420,
    classify_money_dispute
)

from app.data.ipc_sections import (
    IPC_SECTIONS,
    IT_ACT_SECTIONS,
    get_section,
    search_sections
)

__all__ = [
    'IPC_420_RULES',
    'MONEY_DISPUTE_CLASSIFICATION',
    'ASSET_TYPE_RULES',
    'THREAT_CLASSIFICATION',
    'validate_ipc_420',
    'classify_money_dispute',
    'IPC_SECTIONS',
    'IT_ACT_SECTIONS',
    'get_section',
    'search_sections'
]