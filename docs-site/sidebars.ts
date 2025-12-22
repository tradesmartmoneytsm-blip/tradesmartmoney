import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: '🏠 Introduction',
    },
    {
      type: 'category',
      label: '📊 Indices',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'Dhan',
          items: [
            'indices/dhan',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: '🗄️ Database Tables',
      collapsed: false,
      items: [
        'database/overview',
        'database/nse_sector_data',
        'database/dhan_sector_indices_config',
        'database/momentum_stocks',
        'database/futures_analysis',
        'database/option_chain_analysis',
      ],
    },
    {
      type: 'category',
      label: '🐍 Python Scripts',
      collapsed: false,
      items: [
        'scripts/overview',
        'scripts/nse_sector_data_collector',
        'scripts/dhan_indices_collector',
        'scripts/dhan_historical_data_collector',
        'scripts/momentum_stocks_collector',
        'scripts/futures_analyzer',
        'scripts/option_chain_analyzer',
      ],
    },
    {
      type: 'category',
      label: '📡 Data Sources',
      collapsed: false,
      items: [
        'data-sources/overview',
      ],
    },
    {
      type: 'doc',
      id: 'data-flows',
      label: '🔄 Data Flows',
    },
  ],
};

export default sidebars;
