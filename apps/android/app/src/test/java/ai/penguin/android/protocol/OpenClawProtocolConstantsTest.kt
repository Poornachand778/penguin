package ai.penguin.android.protocol

import org.junit.Assert.assertEquals
import org.junit.Test

class PenguinProtocolConstantsTest {
  @Test
  fun canvasCommandsUseStableStrings() {
    assertEquals("canvas.present", PenguinCanvasCommand.Present.rawValue)
    assertEquals("canvas.hide", PenguinCanvasCommand.Hide.rawValue)
    assertEquals("canvas.navigate", PenguinCanvasCommand.Navigate.rawValue)
    assertEquals("canvas.eval", PenguinCanvasCommand.Eval.rawValue)
    assertEquals("canvas.snapshot", PenguinCanvasCommand.Snapshot.rawValue)
  }

  @Test
  fun a2uiCommandsUseStableStrings() {
    assertEquals("canvas.a2ui.push", PenguinCanvasA2UICommand.Push.rawValue)
    assertEquals("canvas.a2ui.pushJSONL", PenguinCanvasA2UICommand.PushJSONL.rawValue)
    assertEquals("canvas.a2ui.reset", PenguinCanvasA2UICommand.Reset.rawValue)
  }

  @Test
  fun capabilitiesUseStableStrings() {
    assertEquals("canvas", PenguinCapability.Canvas.rawValue)
    assertEquals("camera", PenguinCapability.Camera.rawValue)
    assertEquals("screen", PenguinCapability.Screen.rawValue)
    assertEquals("voiceWake", PenguinCapability.VoiceWake.rawValue)
  }

  @Test
  fun screenCommandsUseStableStrings() {
    assertEquals("screen.record", PenguinScreenCommand.Record.rawValue)
  }
}
