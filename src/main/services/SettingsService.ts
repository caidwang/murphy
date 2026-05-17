import { getDb } from '../repositories/database';

export interface RollcallSettings {
  allowRepeat: boolean;
  noRepeatCorrectOnly: boolean;
  autoSave: boolean;
  scrollSpeed: 'slow' | 'medium' | 'fast';
}

const DEFAULT_SETTINGS: RollcallSettings = {
  allowRepeat: true,
  noRepeatCorrectOnly: true,
  autoSave: true,
  scrollSpeed: 'medium',
};

export class SettingsService {
  /**
   * Gets the rollcall settings.
   */
  getRollcallSettings(): RollcallSettings {
    const settings: RollcallSettings = { ...DEFAULT_SETTINGS };

    try {
      const db = getDb();
      const rows = db.prepare('SELECT key, value FROM settings WHERE key LIKE ?').all('rollcall_%') as Array<{
        key: string;
        value: string;
      }>;

      for (const row of rows) {
        const key = row.key.replace('rollcall_', '');
        const value = row.value;

        switch (key) {
          case 'allowRepeat':
            settings.allowRepeat = value === 'true';
            break;
          case 'noRepeatCorrectOnly':
            settings.noRepeatCorrectOnly = value === 'true';
            break;
          case 'autoSave':
            settings.autoSave = value === 'true';
            break;
          case 'scrollSpeed':
            if (['slow', 'medium', 'fast'].includes(value)) {
              settings.scrollSpeed = value as 'slow' | 'medium' | 'fast';
            }
            break;
        }
      }
    } catch (error) {
      console.error('Failed to get rollcall settings:', error);
    }

    return settings;
  }

  /**
   * Saves the rollcall settings.
   */
  saveRollcallSettings(settings: RollcallSettings): void {
    try {
      const db = getDb();
      const upsertStmt = db.prepare(
        'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)'
      );

      const saveTransaction = db.transaction(() => {
        upsertStmt.run('rollcall_allowRepeat', String(settings.allowRepeat));
        upsertStmt.run('rollcall_noRepeatCorrectOnly', String(settings.noRepeatCorrectOnly));
        upsertStmt.run('rollcall_autoSave', String(settings.autoSave));
        upsertStmt.run('rollcall_scrollSpeed', settings.scrollSpeed);
      });

      saveTransaction();
    } catch (error) {
      console.error('Failed to save rollcall settings:', error);
      throw new Error('Failed to save settings.');
    }
  }
}
