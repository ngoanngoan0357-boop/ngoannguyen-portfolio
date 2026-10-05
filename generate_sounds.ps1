Add-Type -TypeDefinition @"
using System;
using System.IO;

public class BarkGenerator {
    private static void RenderBurst(float[] buffer, int totalSamples, int sampleRate, int startSample, double duration, double startPitch, Random rand) {
        int burstSamples = (int)(duration * sampleRate);
        for (int i = 0; i < burstSamples; i++) {
            double t = (double)i / sampleRate;
            double p = t / duration;

            double freq = startPitch * (1.0 - 0.42 * Math.Pow(p, 0.65));

            double env = 0.0;
            double attackTime = 0.015;
            if (t < attackTime) {
                env = t / attackTime;
            } else {
                env = Math.Pow(1.0 - (t - attackTime) / (duration - attackTime), 2.2);
            }

            double wave = Math.Sin(2.0 * Math.PI * freq * t) * 0.55;
            wave += Math.Sin(2.0 * Math.PI * freq * 2.08 * t) * 0.35;
            wave += Math.Sin(2.0 * Math.PI * freq * 3.12 * t) * 0.18;

            double noise = (rand.NextDouble() * 2.0 - 1.0) * 0.28 * Math.Pow(1.0 - p, 1.5);
            wave += noise;

            wave = Math.Tanh(wave * 1.8) * 0.85 * env;

            int targetIdx = startSample + i;
            if (targetIdx < totalSamples) {
                buffer[targetIdx] += (float)wave;
            }
        }
    }

    public static void GenerateBarkWav(string filePath, int sampleRate, double baseFreq1, double baseFreq2, bool isDouble) {
        double dur1 = 0.18;
        double pause = isDouble ? 0.09 : 0.0;
        double dur2 = isDouble ? 0.22 : 0.0;
        double totalDur = dur1 + pause + dur2 + 0.05;
        int totalSamples = (int)(totalDur * sampleRate);
        float[] buffer = new float[totalSamples];
        Random rand = new Random(42);

        RenderBurst(buffer, totalSamples, sampleRate, 0, dur1, baseFreq1, rand);
        if (isDouble) {
            int secondStart = (int)((dur1 + pause) * sampleRate);
            RenderBurst(buffer, totalSamples, sampleRate, secondStart, dur2, baseFreq2, rand);
        }

        using (FileStream fs = new FileStream(filePath, FileMode.Create)) {
            using (BinaryWriter bw = new BinaryWriter(fs)) {
                bw.Write(System.Text.Encoding.ASCII.GetBytes("RIFF"));
                bw.Write(36 + totalSamples * 2);
                bw.Write(System.Text.Encoding.ASCII.GetBytes("WAVE"));
                bw.Write(System.Text.Encoding.ASCII.GetBytes("fmt "));
                bw.Write(16);
                bw.Write((short)1); // PCM
                bw.Write((short)1); // 1 channel mono
                bw.Write(sampleRate);
                bw.Write(sampleRate * 2);
                bw.Write((short)2);
                bw.Write((short)16);
                bw.Write(System.Text.Encoding.ASCII.GetBytes("data"));
                bw.Write(totalSamples * 2);

                for (int i = 0; i < totalSamples; i++) {
                    float val = Math.Max(-1.0f, Math.Min(1.0f, buffer[i]));
                    bw.Write((short)(val * 32767));
                }
            }
        }
    }
}
"@

$targetDir = "C:\Users\X\.gemini\antigravity-ide\scratch\tintin-portfolio\assets\sounds"
[BarkGenerator]::GenerateBarkWav("$targetDir\snowy-bark-single.wav", 44100, 480, 0, $false)
[BarkGenerator]::GenerateBarkWav("$targetDir\snowy-bark-double.wav", 44100, 450, 490, $true)
[BarkGenerator]::GenerateBarkWav("$targetDir\snowy-yip.wav", 44100, 620, 0, $false)
Write-Output "Sound generation completed!"
