import { useState, useEffect } from 'react';
import { Button } from '~/components/ui/button';

interface Props {
  classroomId: number;
  onNavigateBack: () => void;
}

interface RollcallSettings {
  allowRepeat: boolean;
  noRepeatCorrectOnly: boolean;
  autoSave: boolean;
  scrollSpeed: 'slow' | 'medium' | 'fast';
}

export default function RollcallSettingsPage({ classroomId, onNavigateBack }: Props) {
  const [settings, setSettings] = useState<RollcallSettings>({
    allowRepeat: true,
    noRepeatCorrectOnly: true,
    autoSave: true,
    scrollSpeed: 'medium',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const savedSettings = await window.electron.ipcRenderer.invoke('settings:get');
      if (savedSettings) {
        setSettings(savedSettings);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await window.electron.ipcRenderer.invoke('settings:save', settings);
      alert('设置已保存');
      onNavigateBack();
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('保存设置失败');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDrawState = async () => {
    const confirmed = window.confirm('确认清空当前班级的抽签范围和加倍状态？排行榜数据不会被清空。');
    if (!confirmed) return;

    setIsResetting(true);
    try {
      await window.electron.ipcRenderer.invoke('rollcall:resetStudentStates', classroomId);
      alert('抽签状态已重置');
    } catch (error) {
      console.error('Failed to reset rollcall state:', error);
      alert('重置抽签状态失败');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="w-full h-screen flex">
      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" size="icon" onClick={onNavigateBack}>
            &lt;
          </Button>
          <h1 className="notion-title">设置</h1>
        </div>

        <div className="max-w-3xl">
          <div className="card-shadow p-8">
            <h2 className="notion-subtitle mb-6">点名规则</h2>

            <div className="space-y-6">
              {/* Allow Repeat Toggle */}
              <div
                className="flex items-center justify-between py-4"
                style={{ borderBottom: '1px solid var(--border-color)' }}
              >
                <div className="flex-1">
                  <h3 className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                    点过后是否放回
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    开启后，已点过的学生可以再次被抽中
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.allowRepeat}
                    onChange={(e) =>
                      setSettings({ ...settings, allowRepeat: e.target.checked })
                    }
                  />
                  <div
                    className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                    style={{ background: 'var(--border-color)' }}
                  ></div>
                </label>
              </div>

              {!settings.allowRepeat && (
                <div
                  className="flex items-center justify-between py-4"
                  style={{ borderBottom: '1px solid var(--border-color)' }}
                >
                  <div className="flex-1">
                    <h3 className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                      仅答对后不放回
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      开启后，答错的学生会被加倍并继续留在牌堆
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.noRepeatCorrectOnly}
                      onChange={(e) =>
                        setSettings({ ...settings, noRepeatCorrectOnly: e.target.checked })
                      }
                    />
                    <div
                      className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                      style={{ background: 'var(--border-color)' }}
                    ></div>
                  </label>
                </div>
              )}

              {/* Auto Save Toggle */}
              <div
                className="flex items-center justify-between py-4"
                style={{ borderBottom: '1px solid var(--border-color)' }}
              >
                <div className="flex-1">
                  <h3 className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                    自动保存反馈
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    自动保存每次点名的反馈数据
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.autoSave}
                    onChange={(e) =>
                      setSettings({ ...settings, autoSave: e.target.checked })
                    }
                  />
                  <div
                    className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                    style={{ background: 'var(--border-color)' }}
                  ></div>
                </label>
              </div>

              {/* Scroll Speed Select */}
              <div className="flex items-center justify-between py-4">
                <div className="flex-1">
                  <h3 className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                    滚动速度
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    调整名字滚动的速度
                  </p>
                </div>
                <select
                  className="px-4 py-2 rounded-lg text-sm border border-input bg-white"
                  value={settings.scrollSpeed}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      scrollSpeed: e.target.value as 'slow' | 'medium' | 'fast',
                    })
                  }
                >
                  <option value="slow">慢速</option>
                  <option value="medium">中速</option>
                  <option value="fast">快速</option>
                </select>
              </div>
            </div>

            <div className="mt-8 rounded-lg border border-[#F3C7B8] bg-[#FFF6F2] p-4">
              <h3 className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                重置抽签状态
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                只清空哪些学生已移出牌堆和魔法加倍状态，不影响排行榜和历史点名记录。
              </p>
              <Button
                variant="outline"
                onClick={handleResetDrawState}
                disabled={isResetting}
                className="border-[#D96D3D] text-[#9A3E1E] hover:bg-[#FFEDE6]"
              >
                {isResetting ? '重置中...' : '重置抽签状态'}
              </Button>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={onNavigateBack}
                disabled={isSaving}
                className="btn-secondary"
              >
                取消
              </Button>
              <Button onClick={handleSave} disabled={isSaving} className="btn-primary">
                {isSaving ? '保存中...' : '保存设置'}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
