import { ipcMain } from 'electron';
import { SettingsService, RollcallSettings } from '../services/SettingsService';

let settingsService: SettingsService;

export function registerSettingsHandlers(service: SettingsService): void {
  settingsService = service;

  // Handler for getting rollcall settings
  ipcMain.handle('settings:get', async () => {
    try {
      const settings = settingsService.getRollcallSettings();
      return settings;
    } catch (error) {
      console.error('Failed to get settings:', error);
      throw new Error('Failed to get settings.');
    }
  });

  // Handler for saving rollcall settings
  ipcMain.handle('settings:save', async (_event, settings: RollcallSettings) => {
    try {
      settingsService.saveRollcallSettings(settings);
      return true;
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw new Error('Failed to save settings.');
    }
  });
}
